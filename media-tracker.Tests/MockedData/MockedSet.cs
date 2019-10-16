using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;
using Moq;
using TestingDemo;

namespace media_tracker.Tests.MockedData
{
    /// <summary>
    /// For generating a mocked set from a List
    /// A mocked Set are each of the elements that are contained in a mocked DB table
    /// </summary>
    /// <typeparam name="Model"></typeparam>
    public class MockedSet<Model> where Model : class
    {
        public Mock<DbSet<Model>> Data { get; set; }

        public MockedSet(List<Model> mockedData)
        {
            var queryable = mockedData.AsQueryable();

            var mockSet = new Mock<DbSet<Model>>();
            mockSet.As<IQueryable<Model>>().Setup(m => m.Provider).Returns(new TestDbAsyncQueryProvider<Model>(queryable.Provider));
            mockSet.As<IQueryable<Model>>().Setup(m => m.Expression).Returns(queryable.Expression);
            mockSet.As<IQueryable<Model>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            mockSet.As<IDbAsyncEnumerable<Model>>().Setup(m => m.GetAsyncEnumerator()).Returns(new TestDbAsyncEnumerator<Model>(queryable.GetEnumerator()));
            mockSet.As<IQueryable<Model>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());

            // Mocking add method in the context
            mockSet.Setup(m => m.Add(It.IsAny<Model>())).Callback((Model data) => mockedData.Add(data));
            mockSet.Setup(m => m.AddAsync(It.IsAny<Model>(), It.IsAny<CancellationToken>())).Callback((Model data, CancellationToken cancellationToken) => mockedData.Add(data));

            // Mocking remove method in the context
            mockSet.Setup(m => m.Remove(It.IsAny<Model>())).Callback((Model data) => mockedData.Remove(data));

            // Mocking Find method in the context
            Type type = typeof(Model);
            string colName = "Id";
            // For UserToken entity, the key is UserId
            if(type == typeof(UserToken))
            {
                colName = "UserId";
            }
            var pk = type.GetProperty(colName);
            if (pk == null)
            {
                colName = "Id";
                pk = type.GetProperty(colName);
            }

            mockSet.Setup(x => x.Find(It.IsAny<object[]>())).Returns((object[] id) =>
            {
                var param = Expression.Parameter(type, "t");
                var col = Expression.Property(param, colName);
                var body = Expression.Equal(col, Expression.Constant(id[0]));
                var lambda = Expression.Lambda<Func<Model, bool>>(body, param);
                return queryable.FirstOrDefault(lambda);
            });

            mockSet.Setup(x => x.FindAsync(It.IsAny<object[]>())).Returns((object[] id) =>
            {
                var param = Expression.Parameter(type, "t");
                var col = Expression.Property(param, colName);
                var body = Expression.Equal(col, Expression.Constant(id[0]));
                var lambda = Expression.Lambda<Func<Model, bool>>(body, param);
                return Task.Run(() => queryable.FirstOrDefault(lambda));
            });

            Data = mockSet;
        }
    }
}

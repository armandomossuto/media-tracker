using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Moq;

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
            mockSet.As<IQueryable<Model>>().Setup(m => m.Provider).Returns(queryable.Provider);
            mockSet.As<IQueryable<Model>>().Setup(m => m.Expression).Returns(queryable.Expression);
            mockSet.As<IQueryable<Model>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            mockSet.As<IQueryable<Model>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

            // Mocking add method in the context
            mockSet.Setup(m => m.Add(It.IsAny<Model>())).Callback((Model data) => mockedData.Add(data));

            // Mocking Find method in the context
            Type type = typeof(Model);
            string colName = "Id";
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

            Data = mockSet;
        }
    }
}

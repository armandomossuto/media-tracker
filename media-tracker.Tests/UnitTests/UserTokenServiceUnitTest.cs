using System;
using Xunit;

using media_tracker.Services;
using Moq;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using media_tracker.Helpers;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq.Expressions;

namespace media_tracker.Tests.UnitTests
{
    public class UserTokenServiceUnitTest
    {

        [Fact]
        public void TestGenerateUserRefreshToken()
        {
            // Mocking UserToken context
            var mockSet = new Mock<DbSet<UserToken>>();
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.UsersTokens).Returns(mockSet.Object);

            // Creating a mocked app settings for this test
            var options = Options.Create(new AppSettings
            {
                TokenKey = "asdsdasdasdasdasdasdasdasdasdsadasdadasdada"
            });

            // Creating a new instance of the service that we desire to test with the mocked data
            UserTokenService userTokenService = new UserTokenService(mockContext.Object, options);

            // Excuting Generate User Refresh Token method
            string token = userTokenService.GenerateUserRefreshToken(100);

            // Verify the mocked context method that ran
            mockSet.Verify(m => m.Add(It.IsAny<UserToken>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());

            // Verifying token result
            Assert.Equal(44, token.Length);
        }

        [Fact]
        public void TestGenerateUserAccessToken()
        {
            // Mocking UserToken context
            var mockSet = new Mock<DbSet<UserToken>>();
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.UsersTokens).Returns(mockSet.Object);

            // Creating a mocked app settings for this test
            var options = Options.Create(new AppSettings
            {
                TokenKey = "asdsdasdasdasdasdasdasdasdasdsadasdadasdada"
            });

            // Creating a new instance of the service that we desire to test with the mocked data
            UserTokenService userTokenService = new UserTokenService(mockContext.Object, options);

            // Excuting Generate User Refresh Token method
            string token = userTokenService.GenerateUserAccessToken(100);

            // Verifying token result
            Assert.IsType(typeof(String), token);
        }

        public List<UserToken> GetMockedData()
        {
            var usersTokens = new List<UserToken>();
            for (int i = 0; i < 30; i++)
            {
                usersTokens.Add(new UserToken
                {
                    UserId = i,
                    RefreshToken = "sdasdsdsad"
                });
            }
            return usersTokens;
        }

        [Fact]
        public void TestRefreshTokens()
        {
            // Getting mocked data for the test and converting it to queryable for using it with our mocked context
            var usersTokens = GetMockedData();
            var queryable = usersTokens.AsQueryable();

            // Mocking UserToken context
            var mockSet = new Mock<DbSet<UserToken>>();
            mockSet.As<IQueryable<UserToken>>().Setup(m => m.Provider).Returns(queryable.Provider);
            mockSet.As<IQueryable<UserToken>>().Setup(m => m.Expression).Returns(queryable.Expression);
            mockSet.As<IQueryable<UserToken>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            mockSet.As<IQueryable<UserToken>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

            // Mocking add method in the context
            mockSet.Setup(m => m.Add(It.IsAny<UserToken>())).Callback((UserToken userToken) => usersTokens.Add(userToken));

            // Mocking Find method in the context
            Type type = typeof(UserToken);
            string colName = "UserId";
            var pk = type.GetProperty(colName);
            if (pk == null)
            {
                colName = "UserId";
                pk = type.GetProperty(colName);
            }

            mockSet.Setup(x => x.Find(It.IsAny<object[]>())).Returns((object[] id) =>
            {
                var param = Expression.Parameter(type, "t");
                var col = Expression.Property(param, colName);
                var body = Expression.Equal(col, Expression.Constant(id[0]));
                var lambda = Expression.Lambda<Func<UserToken, bool>>(body, param);
                return queryable.FirstOrDefault(lambda);
            });

            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.UsersTokens).Returns(mockSet.Object);


            // Creating a mocked app settings for this test
            var options = Options.Create(new AppSettings
            {
                TokenKey = "asdsdasdasdasdasdasdasdasdasdsadasdadasdada"
            });

            int userId = 1;

            // Creating a new instance of the service that we desire to test with the mocked data
            UserTokenService userTokenService = new UserTokenService(mockContext.Object, options);

            // Creating a refresh and a access tokens
            string refreshToken = userTokenService.GenerateUserRefreshToken(userId);
            string accessToken = userTokenService.GenerateUserAccessToken(userId);
            Tokens oldTokens = new Tokens(userId, refreshToken, accessToken);

            // Excuting refreshTokens
            Tokens newTokens = userTokenService.RefreshTokens(refreshToken, accessToken);
       
            // Verify the mocked context method that ran
            mockContext.Verify(m => m.SaveChanges(), Times.Exactly(2));

            // Verify result

            // UserId should be the same between both objects
            Assert.Equal(oldTokens.UserTokenView.UserId, newTokens.UserTokenView.UserId);

            // Tokens should be different
            Assert.NotEqual(oldTokens, newTokens);
        }
    }
}

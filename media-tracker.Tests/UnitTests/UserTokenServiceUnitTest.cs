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
using System.Threading.Tasks;
using System.Threading;
using media_tracker.Tests.MockedData;

namespace media_tracker.Tests.UnitTests
{
    public class UserTokenServiceUnitTest
    {
        public UserTokenService GetMockedService(Mock<MediaTrackerContext> mockContext)
        {
            var options = Options.Create(new AppSettings
            {
                TokenKey = "asdsdasdasdasdasdasdasdasdasdsadasdadasdada"
            });

            return new UserTokenService(mockContext.Object, options);
        }

        [Fact]
        public async Task TestGenerateUserRefreshToken()
        {
            var cancellationToken = new CancellationToken();

            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserTokenService userTokenService = GetMockedService(mockedContext.Context);

            // Excuting Generate User Refresh Token method
            string token = await userTokenService.GenerateUserRefreshToken(100);

            // Verify the mocked context method that ran
            mockedContext.UsersTokensSet.Data.Verify(m => m.AddAsync(It.IsAny<UserToken>(), cancellationToken), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChangesAsync(cancellationToken), Times.Once());

            // Verifying token result
            Assert.Equal(44, token.Length);
        }

        [Fact]
        public void TestGenerateUserAccessToken()
        {
            // Mocking UserToken context
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserTokenService userTokenService = GetMockedService(mockedContext.Context);

            // Excuting Generate User Refresh Token method
            string token = userTokenService.GenerateUserAccessToken(100);

            // Verifying token result
            Assert.Equal(typeof(String), token.GetType());
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
        public async Task TestRefreshTokens()
        {
            var cancellationToken = new CancellationToken();

            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserTokenService userTokenService = GetMockedService(mockedContext.Context);

            int userId = 1;

            // Creating a refresh and a access tokens
            string refreshToken = await userTokenService.GenerateUserRefreshToken(userId);
            string accessToken = userTokenService.GenerateUserAccessToken(userId);
            Tokens oldTokens = new Tokens(userId, refreshToken, accessToken);

            // Excuting refreshTokens
            Tokens newTokens = await userTokenService.RefreshTokens(refreshToken, accessToken);

            // Verify the mocked context method that ran
            mockedContext.Context.Verify(m => m.SaveChangesAsync(cancellationToken), Times.Exactly(2));

            // Verify result

            // UserId should be the same between both objects
            Assert.Equal(oldTokens.UserTokenView.UserId, newTokens.UserTokenView.UserId);

            // Tokens should be different
            Assert.NotEqual(oldTokens, newTokens);
        }
    }
}

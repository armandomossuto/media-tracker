using System;
using Xunit;
using media_tracker.Services;
using media_tracker.Models;
using media_tracker.Helpers;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using media_tracker.Tests.MockedData;

namespace media_tracker.Tests.UnitTests
{
    public class UserTokenServiceUnitTest
    {
        public UserTokenService GetMockedService(MediaTrackerContext mockContext)
        {
            var options = Options.Create(new AppSettings
            {
                TokenKey = "asdsdasdasdasdasdasdasdasdasdsadasdadasdada"
            });

            return new UserTokenService(mockContext, options);
        }

        [Fact]
        public async Task TestGenerateUserRefreshToken()
        {
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserTokenService userTokenService = GetMockedService(mockedContext.Context);

            // Excuting Generate User Refresh Token method
            string token = await userTokenService.GenerateUserRefreshToken(100);

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

            // UserId should be the same between both objects
            Assert.Equal(oldTokens.UserTokenView.UserId, newTokens.UserTokenView.UserId);

            // Tokens should be different
            Assert.NotEqual(oldTokens, newTokens);
        }
    }
}

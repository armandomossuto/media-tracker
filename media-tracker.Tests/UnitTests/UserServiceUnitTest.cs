﻿using System.Linq;
using System.Threading.Tasks;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Xunit;

namespace media_tracker.Tests.UnitTests
{
    public class UserServiceUnitTest
    {
        
        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public UserService GetMockedService(MediaTrackerContext mockContext)
        {
            return new UserService(mockContext);
        }

        [Fact]
        public async Task GetUserById()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserService userService = GetMockedService(mockedContext.Context);

            int userId = 3;
            User user = await userService.GetUserById(userId);

            // Verify result
            Assert.Equal(mockedData.Users.Find(u => u.Id == userId), user);
        }

        [Fact]
        public async Task GetUserByUsername()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserService userService = GetMockedService(mockedContext.Context);

            string username = "user4";
            User user = await userService.GetUserByUsername(username);

            // Verify result
            Assert.Equal(mockedData.Users.Find(u => u.Username == username), user);
        }

        [Fact]
        public void PreparesNewUser()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserService userService = GetMockedService(mockedContext.Context);

            string initialPassword = "password";
            User newUser = new User
            {
                Username = "userTest",
                Password = initialPassword,
                Email = "email@test.com"
            };

            User preparedUser = userService.PreparesNewUser(newUser);

            // Verify result
            Assert.Equal(preparedUser.Username, newUser.Username);
            Assert.Equal(preparedUser.Email, newUser.Email);
            Assert.NotEqual(initialPassword, preparedUser.Password);
            Assert.NotNull(preparedUser.Salt);
            Assert.NotNull(preparedUser.CreationDate);
            Assert.NotNull(preparedUser.ModificationDate);
        }

        [Fact]
        public async Task AddUserSuccess()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserService userService = GetMockedService(mockedContext.Context);

            User newUser = new User
            {
                Username = "userTest",
                Password = "password",
                Email = "email@test.com"
            };

            await userService.AddUser(newUser);
            // Verify the new User has been added
            Assert.NotNull(mockedContext.Context.Users.Single(u => u.Username == newUser.Username));
        }

        [Fact]
        public async Task UpdateUser()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserService userService = GetMockedService(mockedContext.Context);

            int userId = 5;
            User newUserInformation = new User
            {
                Username = "newUsername",
            };

            await userService.UpdateUser(userId, newUserInformation);

            User user = await userService.GetUserById(userId);

            // Verify results
            Assert.Equal(user.Username, newUserInformation.Username);
            Assert.NotNull(mockedContext.Context.Users.SingleOrDefault(u => newUserInformation.Username == u.Username));
        }
    }
}

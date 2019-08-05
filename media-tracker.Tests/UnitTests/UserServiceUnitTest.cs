using System;
using System.Collections.Generic;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Moq;
using Xunit;

namespace media_tracker.Tests.UnitTests
{
    public class UserServiceUnitTest
    {
        /// <summary>
        /// Generates mocked data
        /// </summary>
        /// <returns></returns>
        public List<User> GenerateMockedData()
        {
            var users = new List<User>();
            for (int i = 0; i < 30; i++)
            {
                users.Add(new User
                {
                    Id = i,
                    Username = "user" + i,
                    Email = "email" + i + "@test.com",
                    CreationDate = new DateTime(),
                    ModificationDate = new DateTime(),
                    Password = "asads",
                    Salt = new byte[23],
                });
            }

            return users;
        }

        /// <summary>
        /// Generates Mocked Set and Context for the testing
        /// </summary>
        /// <param name="users"></param>
        /// <returns></returns>
        public MockedContext<User> GetMockedContext(List<User> users)
        {
            var mockSet = new MockedSet<User>(users);

            // Mocking UserToken context
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.Users).Returns(mockSet.Data.Object);

            return new MockedContext<User>
            {
                Context = mockContext,
                Set = mockSet.Data
            };
        }
        
        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public UserService GetMockedService(Mock<MediaTrackerContext> mockContext)
        {
            return new UserService(mockContext.Object);
        }

        [Fact]
        public void GetUserById()
        {
            List<User> usersContext = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<User> mockedContext = GetMockedContext(usersContext);
            UserService userService = GetMockedService(mockedContext.Context);

            int userId = 10;
            User user = userService.GetUserById(userId);

            // Verify result
            Assert.Equal(usersContext[userId], user);
        }

        [Fact]
        public void GetUserByUsername()
        {
            List<User> usersContext = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<User> mockedContext = GetMockedContext(usersContext);
            UserService userService = GetMockedService(mockedContext.Context);

            string username = "user11";
            User user = userService.GetUserByUsername(username);

            // Verify result
            Assert.Equal(usersContext.Find(u => u.Username == username), user);
        }

        [Fact]
        public void PreparesNewUser()
        {
            List<User> usersContext = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<User> mockedContext = GetMockedContext(usersContext);
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
        public void AddUserSuccess()
        {
            List<User> usersContext = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<User> mockedContext = GetMockedContext(usersContext);
            UserService userService = GetMockedService(mockedContext.Context);

            User newUser = new User
            {
                Username = "userTest",
                Password = "password",
                Email = "email@test.com"
            };

            userService.AddUser(newUser);

            var mockSet = mockedContext.Set;
            var mockContext = mockedContext.Context;

            // Verify the new User has been added
            mockSet.Verify(m => m.Add(It.IsAny<User>()), Times.Once());
            mockContext.Verify(m => m.SaveChanges(), Times.Once());
        }

        [Fact]
        public void UpdateUser()
        {
            List<User> usersContext = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<User> mockedContext = GetMockedContext(usersContext);
            UserService userService = GetMockedService(mockedContext.Context);

            int userId = 13;
            User newUserInformation = new User
            {
                Username = "newUsername",
            };

            userService.UpdateUser(userId, newUserInformation);

            User user = userService.GetUserById(userId);

            // Verify results
            Assert.Equal(user.Username, newUserInformation.Username);
            mockedContext.Context.Verify(m => m.SaveChanges(), Times.Once());
        }
    }
}

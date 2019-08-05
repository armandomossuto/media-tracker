using System;
using System.Collections.Generic;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Moq;
using Xunit;

namespace media_tracker.Tests.UnitTests
{

    public class UserCategoryServiceUnitTest
    {
        public class UserCategoryMockedData
        {
            public List<UserCategory> UserCategories { get; set; }
            public List<Category> Categories { get; set; }

        }

        /// <summary>
        /// Generates mocked data
        /// </summary>
        /// <returns></returns>
        public UserCategoryMockedData GenerateMockedData()
        {
            var usersCategories = new List<UserCategory>();
            for (int i = 0; i < 5; i++)
            {
                usersCategories.Add(new UserCategory
                {
                    Id = i,
                    CategoryId = i,
                    UserId = i,
                });
            }

            var categories = new List<Category>();

            for (int i = 0; i < 5; i++)
            {
                categories.Add(new Category
                {
                    Id = i,
                    Name = "category" + i,
                    Description = "description" + i
                });
            }

            return new UserCategoryMockedData
            {
                UserCategories = usersCategories,
                Categories = categories
            };
        }


        /// <summary>
        /// Generates Mocked Set and Context for the testing
        /// </summary>
        /// <param name="mockedData"></param>
        /// <returns></returns>
        public MockedContext<UserCategory> GetMockedContext(UserCategoryMockedData mockedData)
        {
            var userCategoriesMockSet = new MockedSet<UserCategory>(mockedData.UserCategories);
            var categoriesMockSet = new MockedSet<Category>(mockedData.Categories);


            // Mocking context
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.UsersCategories).Returns(userCategoriesMockSet.Data.Object);
            mockContext.Setup(m => m.Categories).Returns(categoriesMockSet.Data.Object);

            return new MockedContext<UserCategory>
            {
                Context = mockContext,
                Set = userCategoriesMockSet.Data
            };
        }

        /// <summary>
        /// Generates Mocked Set and Context for the testing
        /// </summary>
        /// <param name="categories"></param>
        /// <returns></returns>
        public MockedContext<Category> GetCategoryMockedContext(List<Category> categories)
        {
            var mockSet = new MockedSet<Category>(categories);

            // Mocking UserToken context
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.Categories).Returns(mockSet.Data.Object);

            return new MockedContext<Category>
            {
                Context = mockContext,
                Set = mockSet.Data
            };
        }

        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public UserCategoryService GetMockedService(Mock<MediaTrackerContext> mockContext)
        {
            return new UserCategoryService(mockContext.Object);
        }

        [Fact]
        public void GetAllCategories()
        {
            UserCategoryMockedData usersCategoriesMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserCategory> mockedContext = GetMockedContext(usersCategoriesMockedData);
            UserCategoryService userCategoryService = GetMockedService(mockedContext.Context);

            List<Category> categoriesInContext = userCategoryService.GetAllCategories();

            // Checking that we got all the list of categories
            Assert.Equal(usersCategoriesMockedData.Categories, categoriesInContext);
        }

        [Fact]
        public void GetUserCategories()
        {
            UserCategoryMockedData usersCategoriesMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserCategory> mockedContext = GetMockedContext(usersCategoriesMockedData);
            UserCategoryService userCategoryService = GetMockedService(mockedContext.Context);

            int userId = 1;
            List<Category> categoriesInUser = userCategoryService.GetUserCategories(userId);

            var expectedCategory = new Category
            {
                Id = userId,
                Name = "category" + userId,
                Description = "description" + userId
            };

            // Checking that we have the correct list of categories
            Assert.Single(categoriesInUser);
            Assert.Equal(expectedCategory, categoriesInUser[0]);
        }

        [Fact]
        public void AddUserCategory()
        {
            UserCategoryMockedData usersCategoriesMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserCategory> mockedContext = GetMockedContext(usersCategoriesMockedData);
            UserCategoryService userCategoryService = GetMockedService(mockedContext.Context);

            int userId = 1;
            int categoryId = 2;
            var newUserCategory = new UserCategory
            {
                CategoryId = categoryId,
                UserId = userId
            };

            userCategoryService.AddUserCategory(newUserCategory);

            // Checking that the new user category was added correctly
            mockedContext.Set.Verify(m => m.Add(It.IsAny<UserCategory>()), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChanges(), Times.Once());

            // Getting the list of user categories and checking that the new user category is there
            List<Category> categoriesInUser = userCategoryService.GetUserCategories(userId);
            Assert.Equal(2, categoriesInUser.Count);
            Assert.Contains(usersCategoriesMockedData.Categories.Find(u => u.Id == categoryId), categoriesInUser);

        }
    }
}

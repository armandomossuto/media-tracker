using System;
using System.Collections.Generic;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace media_tracker.Tests.UnitTests
{

    public class UserCategoryServiceUnitTest
    {
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
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserCategoryService userCategoryService = GetMockedService(mockedContext.Context);

            List<Category> categoriesInContext = userCategoryService.GetAllCategories();

            // Checking that we got all the list of categories
            Assert.Equal(mockedData.Categories, categoriesInContext);
        }

        [Fact]
        public void GetUserCategories()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
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
            Assert.Equal(JsonConvert.SerializeObject(expectedCategory), JsonConvert.SerializeObject(categoriesInUser[0]));
        }

        [Fact]
        public void AddUserCategory()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
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
            mockedContext.UsersCategoriesSet.Data.Verify(m => m.Add(It.IsAny<UserCategory>()), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChanges(), Times.Once());

            // Getting the list of user categories and checking that the new user category is there
            List<Category> categoriesInUser = userCategoryService.GetUserCategories(userId);
            Assert.Equal(2, categoriesInUser.Count);
            Assert.Contains(mockedData.Categories.Find(u => u.Id == categoryId), categoriesInUser);

        }
    }
}

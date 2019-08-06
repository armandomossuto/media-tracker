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
    public class UserItemServiceUnitTest
    {
        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public UserItemService GetMockedService(Mock<MediaTrackerContext> mockContext)
        {
            return new UserItemService(mockContext.Object);
        }


        [Fact]
        public void GetUserById()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            int categoryId = 1;

            List<Item> itemsInCategory = userItemService.GetAllItemsFromCategory(categoryId);

            // Checking that we got all the list of categories
            Assert.Equal(mockedData.Items.FindAll(i => i.CategoryId == categoryId), itemsInCategory);
        }

        [Fact]
        public void GetAllItemsFromUserCategory()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var userCategory = new UserCategory {
                CategoryId = 1,
                UserId = 1
            };

            List<UserItemView> itemsInCategory = userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that we got all the list of categories
            Assert.Equal(2, itemsInCategory.Count);
        }

        [Fact]
        public void AddNewItem()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var newItem = new Item
            {
                CategoryId = 2,
                Name = "newItem",
                Description = "description"
            };

            int userId = 1;

            userItemService.AddNewItem(newItem, userId);

            // Checking that the new Item was added correctly
            mockedContext.UsersItemsSet.Data.Verify(m => m.Add(It.IsAny<UserItem>()), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChanges(), Times.Exactly(2));


            // Getting the list of user items and checking that the new user item is there
            var expectedUserCategory = new UserCategory
            {
                CategoryId = 2,
                UserId = userId
            };
            var itemsInUser = userItemService.GetAllItemsFromUserCategory(expectedUserCategory);
            Assert.Equal(newItem.Name, itemsInUser.Find(i => i.Name == newItem.Name).Name);
        }

        [Fact]
        public void DeleteUserItem()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var userItemToDelete = new UserItem
            {
                Id = 1,
                ItemId = 1,
                UserId = 1
            };

            var userCategory = new UserCategory
            {
                CategoryId = 1,
                UserId = 1
            };

            var itemsInCategory = userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that the items are initially there
            Assert.Equal(2, itemsInCategory.Count);

            userItemService.DeleteUserItem(userItemToDelete);

            // Checking that the item was deleted
            var updatedItemsInCategory = userItemService.GetAllItemsFromUserCategory(userCategory);
            Assert.Single(updatedItemsInCategory);

        }

    }
}

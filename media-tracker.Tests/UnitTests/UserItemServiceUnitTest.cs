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
        public class UserItemMockedData
        {
            public List<UserItem> UsersItems { get; set; }
            public List<Item> Items { get; set; }

        }

        /// <summary>
        /// Generates mocked data
        /// </summary>
        /// <returns></returns>
        public UserItemMockedData GenerateMockedData()
        {
            var usersItems = new List<UserItem>();
            for (int i = 0; i < 5; i++)
            {
                usersItems.Add(new UserItem
                {
                    Id = i,
                    ItemId = i,
                    UserId = i
                });
            }

            var items = new List<Item>();

            for (int i = 0; i < 5; i++)
            {
                items.Add(new Item
                {
                    Id = i,
                    CategoryId = 1,
                    Name = "item" + i,
                    Description = "description" + i
                });
            }

            return new UserItemMockedData
            {
                UsersItems = usersItems,
                Items = items
            };
        }

        /// <summary>
        /// Generates Mocked Set and Context for the testing
        /// </summary>
        /// <param name="mockedData"></param>
        /// <returns></returns>
        public MockedContext<UserItem> GetMockedContext(UserItemMockedData mockedData)
        {
            var usersItemsMockSet = new MockedSet<UserItem>(mockedData.UsersItems);
            var itemsMockSet = new MockedSet<Item>(mockedData.Items);


            // Mocking context
            var mockContext = new Mock<MediaTrackerContext>();
            mockContext.Setup(m => m.UsersItems).Returns(usersItemsMockSet.Data.Object);
            mockContext.Setup(m => m.Items).Returns(itemsMockSet.Data.Object);

            return new MockedContext<UserItem>
            {
                Context = mockContext,
                Set = usersItemsMockSet.Data
            };
        }


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
            var usersItemsMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserItem> mockedContext = GetMockedContext(usersItemsMockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            int categoryId = 1;

            List<Item> itemsInCategory = userItemService.GetAllItemsFromCategory(categoryId);

            // Checking that we got all the list of categories
            Assert.Equal(usersItemsMockedData.Items, itemsInCategory);
        }

        [Fact]
        public void GetAllItemsFromUserCategory()
        {
            var usersItemsMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserItem> mockedContext = GetMockedContext(usersItemsMockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var userCategory = new UserCategory {
                CategoryId = 1,
                UserId = 1
            };

            List<UserItemView> itemsInCategory = userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that we got all the list of categories
            Assert.Single(itemsInCategory);
        }

        [Fact]
        public void AddNewItem()
        {
            var usersItemsMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserItem> mockedContext = GetMockedContext(usersItemsMockedData);
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
            mockedContext.Set.Verify(m => m.Add(It.IsAny<UserItem>()), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChanges(), Times.Exactly(2));


            // Getting the list of user items and checking that the new user item is there
            var expectedUserCategory = new UserCategory
            {
                CategoryId = 2,
                UserId = userId
            };
            var itemsInUser = userItemService.GetAllItemsFromUserCategory(expectedUserCategory);
            Assert.Single(itemsInUser);
            Assert.Equal(newItem.Name, itemsInUser[0].Name);
        }

        [Fact]
        public void DeleteUserItem()
        {
            var usersItemsMockedData = GenerateMockedData();

            // Creating a new instance of the service that we desire to test with the mocked data
            MockedContext<UserItem> mockedContext = GetMockedContext(usersItemsMockedData);
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

            // Checking that the item is initially there
            Assert.Single(itemsInCategory);

            userItemService.DeleteUserItem(userItemToDelete);

            // Checking that the item was deleted
            var updatedItemsInCategory = userItemService.GetAllItemsFromUserCategory(userCategory);
            Assert.Empty(updatedItemsInCategory);

        }

    }
}

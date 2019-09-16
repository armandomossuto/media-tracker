using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Moq;
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
        public async Task GetUserById()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            int categoryId = 1;

            List<Item> itemsInCategory = await userItemService.GetAllItemsFromCategory(categoryId);

            // Checking that we got all the list of categories
            Assert.Equal(mockedData.Items.FindAll(i => i.CategoryId == categoryId), itemsInCategory);
        }

        [Fact]
        public async Task GetAllItemsFromUserCategory()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var userCategory = new UserCategory {
                CategoryId = 1,
                UserId = 1
            };

            List<UserItemView> itemsInCategory = await userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that we got all the list of categories
            Assert.Equal(2, itemsInCategory.Count);
        }

        [Fact]
        public async Task AddNewItem()
        {
            var cancellationToken = new CancellationToken();
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

            await userItemService.AddNewItem(newItem, userId);

            // Checking that the new Item was added correctly
            mockedContext.UsersItemsSet.Data.Verify(m => m.AddAsync(It.IsAny<UserItem>(), cancellationToken), Times.Once());
            mockedContext.Context.Verify(m => m.SaveChangesAsync(cancellationToken), Times.Exactly(2));


            // Getting the list of user items and checking that the new user item is there
            var expectedUserCategory = new UserCategory
            {
                CategoryId = 2,
                UserId = userId
            };
            var itemsInUser = await userItemService.GetAllItemsFromUserCategory(expectedUserCategory);
            Assert.Equal(newItem.Name, itemsInUser.Find(i => i.Name == newItem.Name).Name);
        }

        [Fact]
        public async Task DeleteUserItem()
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

            var itemsInCategory = await userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that the items are initially there
            Assert.Equal(2, itemsInCategory.Count);

            await userItemService.DeleteUserItem(userItemToDelete);

            // Checking that the item was deleted
            var updatedItemsInCategory = await userItemService.GetAllItemsFromUserCategory(userCategory);
            Assert.Single(updatedItemsInCategory);
        }

        [Fact]
        public async Task UpdateUserItemRating()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            UpdateUserItem updateUserItem = new UpdateUserItem
            {
                UserId = 1,
                ItemId = 1,
                NewUserItemInformation = new UserItem
                {
                    Rating = 4
                }
            };

            await userItemService.UpdateUserItem(updateUserItem);

            // Checking that the item rating was correctly updated and the other properties remain without any change
            Assert.Equal(updateUserItem.NewUserItemInformation.Rating, mockedData.UsersItems.Find(u => u.UserId == 1 && u.ItemId == 1).Rating);
            Assert.Equal(ItemState.NotSet, mockedData.UsersItems.Find(u => u.UserId == 1 && u.ItemId == 1).State);
        }

        [Fact]
        public async Task UpdateUserItemState()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            UpdateUserItem updateUserItem = new UpdateUserItem
            {
                UserId = 1,
                ItemId = 1,
                NewUserItemInformation = new UserItem
                {
                    State = ItemState.Completed
                }
            };

            await userItemService.UpdateUserItem(updateUserItem);

            // Checking that the item rating was correctly updated and the other properties remain without any change
            Assert.Equal(0, mockedData.UsersItems.Find(u => u.UserId == 1 && u.ItemId == 1).Rating);
            Assert.Equal(ItemState.Completed, mockedData.UsersItems.Find(u => u.UserId == 1 && u.ItemId == 1).State);
        }
    }
}

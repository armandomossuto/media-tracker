using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Xunit;

namespace media_tracker.Tests.UnitTests
{
    public class UserItemServiceUnitTest
    {
        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public UserItemService GetMockedService(MediaTrackerContext mockContext) =>
            new UserItemService(mockContext);
     

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
                CategoryId = 2,
                UserId = 2
            };

            List<UserItemView> itemsInCategory = await userItemService.GetAllItemsFromUserCategory(userCategory);

            // Checking that we got all the list of categories
            Assert.Equal(2, itemsInCategory.Count);
        }

        [Fact]
        public async Task AddNewItem()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var newItem = new Item
            {
                CategoryId = 2,
            };

            var item = await userItemService.AddNewItem(newItem);
            Assert.NotNull(mockedContext.Context.Items.Find(item.Id));
        }

        [Fact]
        public async Task AddUserItem()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);
            UserItemService userItemService = GetMockedService(mockedContext.Context);

            var userItem = new UserItem
            {
                ItemId = 5,
                UserId = 1,
            };

            await userItemService.AddUserItem(userItem);

            // Checking that the new Item was added correctly
            Assert.NotNull(mockedContext.Context.UsersItems.Single(i => i.ItemId == userItem.ItemId & i.UserId == userItem.UserId));
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
                Id = 3,
                ItemId = 3,
                UserId = 2
            };

            var userCategory = new UserCategory
            {
                CategoryId = 2,
                UserId = 2
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
                NewUserItemInformation = new NewUserItemProperties
                {
                    Rating = 4
                }
            };

            await userItemService.UpdateUserItem(updateUserItem);

            // Checking that the item rating was correctly updated and the other properties remain without any change
            Assert.Equal(updateUserItem.NewUserItemInformation.Rating, mockedContext.Context.UsersItems.Single(u => u.UserId == 1 && u.ItemId == 1).Rating);
            Assert.Equal(ItemState.NotSet, mockedContext.Context.UsersItems.Single(u => u.UserId == 1 && u.ItemId == 1).State);
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
                NewUserItemInformation = new NewUserItemProperties
                {
                    State = ItemState.Completed
                }
            };

            await userItemService.UpdateUserItem(updateUserItem);

            // Checking that the item rating was correctly updated and the other properties remain without any change
            Assert.Equal(0, mockedContext.Context.UsersItems.Single(u => u.UserId == 1 && u.ItemId == 1).Rating);
            Assert.Equal(ItemState.Completed, mockedContext.Context.UsersItems.Single(u => u.UserId == 1 && u.ItemId == 1).State);
        }
    }
}

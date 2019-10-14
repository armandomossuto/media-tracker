using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the User Categories Model/Controller
    /// </summary>
    public interface IUserItemService
    {
        Task<List<Item>> GetAllItemsFromCategory(int categoryId);
        Task<List<UserItemView>> GetAllItemsFromUserCategory(UserCategory userCategory);
        Task AddUserItem(UserItem userItem);
        Task<Item> AddNewItem(Item newItem);
        Task DeleteUserItem(UserItem userItemToDelete);
        Task UpdateUserItem(UpdateUserItem updateUserItem);
    }

    public class UserItemService : IUserItemService
    {
        private readonly MediaTrackerContext _context;

        public UserItemService(MediaTrackerContext _context)
        {
            this._context = _context;
        }

        /// <summary>
        /// Retrieves a list with all available categories
        /// </summary>
        /// <returns>List of categories</returns>
        public async Task<List<Item>> GetAllItemsFromCategory(int categoryId) =>
            await _context.Items.Where(item => item.CategoryId == categoryId).ToListAsync();

        /// <summary>
        /// Retrieves list of items from a user and a specific category
        /// </summary>
        /// <param name="userCategory"></param>
        /// <returns></returns>
        public async Task<List<UserItemView>> GetAllItemsFromUserCategory(UserCategory userCategory)
        {
            return await (from userItem in _context.UsersItems
                    join item in _context.Items on userItem.ItemId equals item.Id
                    where item.CategoryId == userCategory.CategoryId & userItem.UserId == userCategory.UserId 
                    select new UserItemView(userItem, item)).ToListAsync();
        }

        /// <summary>
        /// Adds a new UserItem to the DB
        /// </summary>
        /// <param name="newUserItem"></param>
        public async Task AddUserItem(UserItem newUserItem)
        {
            await _context.UsersItems.AddAsync(newUserItem);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Adds a new Item to Items and UsersItems tables
        /// </summary>
        /// <param name="newItem"></param>
        /// <returns>The new Item</returns>
        public async Task<Item> AddNewItem(Item newItem)
        {
            await CreateItem(newItem);
            return newItem;
        }

        /// <summary>
        /// Adds a new Item to the Items table
        /// </summary>
        /// <param name="newItem"></param>
        private async Task CreateItem(Item newItem)
        {
            await _context.Items.AddAsync(newItem);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Deletes a user item
        /// </summary>
        /// <param name="userItemToDelete"></param>
        /// <returns></returns>
        public async Task DeleteUserItem(UserItem userItemToDelete)
        {
            UserItem userItemDb = _context.UsersItems.SingleOrDefault(userItem => userItem.UserId == userItemToDelete.UserId & userItem.ItemId == userItemToDelete.ItemId);
            _context.UsersItems.Remove(userItemDb);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates rating and/or state in a user item
        /// </summary>
        /// <param name="updateUserItem"></param>
        /// <returns></returns>
        public async Task UpdateUserItem(UpdateUserItem updateUserItem)
        {
            UserItem userItem = await _context.UsersItems.SingleOrDefaultAsync(u => u.UserId == updateUserItem.UserId & u.ItemId == updateUserItem.ItemId);
            userItem.UpdateExistingUserItem(updateUserItem.NewUserItemInformation);
            await _context.SaveChangesAsync();
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using media_tracker.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the User Categories Model/Controller
    /// </summary>
    public interface IUserItemService
    {
        List<Item> GetAllItemsFromCategory(int categoryId);
        List<UserItemView> GetAllItemsFromUserCategory(UserCategory userCategory);
        void AddUserItem(UserItem userItem);
        Item AddNewItem(Item newItem, int userId);
        void DeleteUserItem(UserItem userItemToDelete);
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
        public List<Item> GetAllItemsFromCategory(int categoryId) =>
            _context.Items.Where(item => item.CategoryId == categoryId).ToList();

        /// <summary>
        /// Retrieves list of items from a user and a specific category
        /// </summary>
        /// <param name="userCategory"></param>
        /// <returns></returns>
        public List<UserItemView> GetAllItemsFromUserCategory(UserCategory userCategory)
        {
            return (from userItem in _context.UsersItems
                    join item in _context.Items on userItem.ItemId equals item.Id
                    where item.CategoryId == userCategory.CategoryId & userItem.UserId == userCategory.UserId 
                    select new UserItemView(userItem, item)).ToList();
        }

        /// <summary>
        /// Adds a new UserItem to the DB
        /// </summary>
        /// <param name="newUserItem"></param>
        public void AddUserItem(UserItem newUserItem)
        {
            _context.UsersItems.Add(newUserItem);
            _context.SaveChanges();
        }

        /// <summary>
        /// Adds a new Item to Items and UsersItems tables
        /// </summary>
        /// <param name="newItem"></param>
        /// <param name="userId"></param>
        /// <returns>The new Item</returns>
        public Item AddNewItem(Item newItem, int userId)
        {
            CreateItem(newItem);
            UserItem newUserItem = new UserItem { UserId = userId, ItemId = newItem.Id };
            _context.UsersItems.Add(newUserItem);
            _context.SaveChanges();
            return newItem;
        }

        /// <summary>
        /// Adds a new Item to the Items table
        /// </summary>
        /// <param name="newItem"></param>
        private void CreateItem(Item newItem)
        {
            _context.Items.Add(newItem);
            _context.SaveChanges();
        }

        public void DeleteUserItem(UserItem userItemToDelete)
        {
            UserItem userItemDb = _context.UsersItems.SingleOrDefault(userItem => userItem.UserId == userItemToDelete.UserId & userItem.ItemId == userItemToDelete.ItemId);
            _context.UsersItems.Remove(userItemDb);
            _context.SaveChanges();
        }

    }
}

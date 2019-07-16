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

    }
}

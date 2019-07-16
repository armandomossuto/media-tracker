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
    public interface IUserCategoryService
    {
        List<Category> GetAllCategories();
        List<Category> GetUserCategories(int userId);
        void AddUserCategory(UserCategory newUserCategory);
    }

    public class UserCategoryService : IUserCategoryService
    {
        private readonly MediaTrackerContext _context;

        public UserCategoryService(MediaTrackerContext _context)
        {
            this._context = _context;
        }

        /// <summary>
        /// Retrieves a list with all available categories
        /// </summary>
        /// <returns>List of categories</returns>
        public List<Category> GetAllCategories() =>
            _context.Categories.ToList();

        /// <summary>
        /// Retrieves a list with all categories from an user
        /// </summary>
        /// <returns>List of categories</returns>
        public List<Category> GetUserCategories(int userId)
        {
            return (from userCategory in _context.UsersCategories
                    join category in _context.Categories on userCategory.CategoryId equals category.Id
                    where userCategory.UserId == userId
                    select category).ToList();
        }

        /// <summary>
        /// Adds a new UserCategory to the DB, which manages a relationship between an user and a category
        /// </summary>
        /// <param name="newUserCategory"></param>
        public void AddUserCategory(UserCategory newUserCategory)
        {
            _context.UsersCategories.Add(newUserCategory);
            _context.SaveChanges();
        }

    }
}

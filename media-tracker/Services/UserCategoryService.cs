using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the User Categories Model/Controller
    /// </summary>
    public interface IUserCategoryService
    {
        Task<List<Category>> GetAllCategories();
        Task<List<Category>> GetUserCategories(int userId);
        Task AddUserCategory(UserCategory newUserCategory);
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
        public async Task<List<Category>> GetAllCategories() =>
            await _context.Categories.ToListAsync();

        /// <summary>
        /// Retrieves a list with all categories from an user
        /// </summary>
        /// <returns>List of categories</returns>
        public async Task<List<Category>> GetUserCategories(int userId)
        {
            return await (from userCategory in _context.UsersCategories
                    join category in _context.Categories on userCategory.CategoryId equals category.Id
                    where userCategory.UserId == userId
                    select category).ToListAsync();
        }

        /// <summary>
        /// Adds a new UserCategory to the DB, which manages a relationship between an user and a category
        /// </summary>
        /// <param name="newUserCategory"></param>
        public async Task AddUserCategory(UserCategory newUserCategory)
        {
            await _context.UsersCategories.AddAsync(newUserCategory);
            await _context.SaveChangesAsync();
        }

    }
}

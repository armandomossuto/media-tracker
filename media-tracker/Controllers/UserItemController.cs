using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using media_tracker.Services;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Controllers
{
    [Route("api/entries")]
    [ApiController]
    public class UserItemController : ControllerBase
    {
        //Injecting Service with controller actions
        private readonly IUserItemService _userItemService;

        public UserItemController(IUserItemService userItemService)
        {
            this._userItemService = userItemService;
        }

        /// <summary>
        /// Returns all available categories
        /// </summary>
        [HttpGet("{categoryId}")]
        public ActionResult<List<Item>> GetAllItemsFromCategory(int categoryId) =>
            _userItemService.GetAllItemsFromCategory(categoryId);

        /// <summary>
        /// Returns all items registered by an user in a category
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{categoryId}/{userId}")]
        public ActionResult<List<UserItemView>> GetAllItemsFromUserCategory(int categoryId, int userId) =>
            _userItemService.GetAllItemsFromUserCategory(new UserCategory
            {
                CategoryId = categoryId,
                UserId = userId
            });
    }

}
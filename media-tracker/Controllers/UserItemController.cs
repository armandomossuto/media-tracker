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
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace media_tracker.Controllers
{
    [Route("api/entries")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UserItemController : ControllerBase
    {
        //Injecting Service with controller actions
        private readonly IUserItemService _userItemService;
        private readonly ILogger<UserItemController> _logger;

        public UserItemController(IUserItemService userItemService, ILogger<UserItemController> logger)
        {
            _userItemService = userItemService;
            _logger = logger;
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

        /// <summary>
        /// Adds an existing Item to the User Tracker
        /// </summary>
        /// <param name="newUserItem"></param>
        /// <returns></returns>
        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult AddUserItem([FromBody] UserItem newUserItem)
        {
            try
            {
                _userItemService.AddUserItem(newUserItem);
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException)
                {
                    return StatusCode(500);
                }
                _logger.LogError("Error when adding new user item", ex);
            }
            return Ok();
        }

        /// <summary>
        /// Adds a new Item to the DB and to the User account
        /// </summary>
        /// <param name="newItem"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpPost("add/new")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<Item> AddUserItem([FromBody] Item newItem, [FromQuery] int userId)
        {
            try
            {
                return _userItemService.AddNewItem(newItem, userId);
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException)
                {
                    return StatusCode(409);
                }
                _logger.LogError("Error when adding new item", ex);
                return StatusCode(500);
            }
        }

        /// <summary>
        /// Removes one item from User's tracker
        /// </summary>
        /// <param name="userItemToDelete"></param>
        /// <returns></returns>
        [HttpDelete()]
        public ActionResult DeleteItemFromUser([FromBody] UserItem userItemToDelete)
        {
            try
            {
                _userItemService.DeleteUserItem(userItemToDelete);
            }
            catch(Exception ex)
            {
                _logger.LogError("Error when deleting a user item", ex);
                return StatusCode(500);
            }
            return Ok();
        }
    }

}
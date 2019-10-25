using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
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
        private readonly IMovieService _movieService;
        private readonly ILogger<UserItemController> _logger;

        public UserItemController(IUserItemService userItemService, IMovieService movieService, ILogger<UserItemController> logger)
        {
            _userItemService = userItemService;
            _movieService = movieService;
            _logger = logger;
        }

        /// <summary>
        /// Returns all available items form a category
        /// </summary>
        [HttpGet("{categoryId}")]
        public async Task<ActionResult<List<Item>>> GetAllItemsFromCategory(int categoryId) =>
            await _userItemService.GetAllItemsFromCategory(categoryId);

        /// <summary>
        /// Returns all items registered by an user in a category
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{categoryId}/{userId}")]
        public async Task<ActionResult<List<UserItemView>>> GetAllItemsFromUserCategory(int categoryId, int userId)
        {
            try
            {
                return await _userItemService.GetAllItemsFromUserCategory(new UserCategory
                {
                    CategoryId = categoryId,
                    UserId = userId
                });
            } catch (DbUpdateException ex)
            {
                _logger.LogError("Error when getting items from user categories", ex);
                return StatusCode(500);
            }

        }

        /// <summary>
        /// Adds an existing Item to the User Tracker
        /// </summary>
        /// <param name="newUserItem"></param>
        /// <returns></returns>
        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddUserItem([FromBody] UserItem newUserItem)
        {
            try
            {
                await _userItemService.AddUserItem(newUserItem);
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
        /// <param name="addItemRequest"></param>
        /// <returns></returns>
        [HttpPost("add/new")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> AddItem([FromBody]AddItem addItemRequest)
        {

            try
            {
                // First we generate the new item
                Item item = await _userItemService.AddNewItem(addItemRequest.ToItem());

                // Adding the new element to the user item DB
                UserItem userItem = new UserItem
                {
                    ItemId = item.Id,
                    UserId = addItemRequest.UserId,
                };
                await _userItemService.AddUserItem(userItem);

                // We double check if the movie really isn't already on DB
                if (await _movieService.FindMovieByExtId(addItemRequest.Item.ExternalId) is Movie movie)
                {
                    // If it is, we don't need to perform the 
                    return movie.ItemId;
                }

                // Then we add to the corresponding table depending on the category Id
                switch (addItemRequest.CategoryId)
                {
                    case 2:
                        await _movieService.AddMovieItem(addItemRequest.ToMovie(item.Id));
                        break;
                    default:
                        return StatusCode(StatusCodes.Status400BadRequest);
                }

                return item.Id;
            }
            catch (DbUpdateException ex)
            {
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
        public async Task<ActionResult> DeleteItemFromUser([FromBody] UserItem userItemToDelete)
        {
            try
            {
                await _userItemService.DeleteUserItem(userItemToDelete);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error when deleting a user item", ex);
                return StatusCode(500);
            }
            return Ok();
        }

        [HttpPost("update")]
        public async Task<ActionResult> UpdateUserItem([FromBody] UpdateUserItem updateUserItem)
        {
            try
            {
                await _userItemService.UpdateUserItem(updateUserItem);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error when updating a user item", ex);
                return StatusCode(500);
            }
            return Ok();
        }

        /// <summary>
        /// Retrieves a list of items according to a user search
        /// </summary>
        /// <param name="itemSearchRequest"></param>
        /// <returns></returns>
        [HttpPost("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<object>> SearchItems([FromBody] ItemSearchRequest itemSearchRequest)
        {
            try
            {
                 switch(itemSearchRequest.CategoryId)
                {
                    case 2: return await _movieService.SearchMovieItems(itemSearchRequest.UserId, itemSearchRequest.SearchTerm, itemSearchRequest.Page);
                    default: return StatusCode(StatusCodes.Status400BadRequest);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error when searching for items", ex);
                return StatusCode(500);
            }
        }
    }

}
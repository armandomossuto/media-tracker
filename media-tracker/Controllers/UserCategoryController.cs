﻿using System;
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
    [Route("api/categories")]
    [ApiController]
    [Authorize (AuthenticationSchemes = "Bearer")]
    public class UserCategoryController : ControllerBase
    {
        //Injecting Service with controller actions
        private readonly IUserCategoryService _userCategoryService;
        private readonly ILogger<UserCategoryController> _logger;

        public UserCategoryController(IUserCategoryService userCategoryService, ILogger<UserCategoryController> logger)
        {
            _userCategoryService = userCategoryService;
            _logger = logger;
        }

        /// <summary>
        /// Returns all available categories
        /// </summary>
        [HttpGet()]
        public ActionResult<List<Category>> GetAllCategories() =>
            _userCategoryService.GetAllCategories();

        /// <summary>
        /// Returns all categories from a user
        /// </summary>
        [HttpGet("{userId}")]
        public ActionResult<List<Category>> GetUserCategories(int userId) =>
            _userCategoryService.GetUserCategories(userId);

        /// <summary>
        /// Adds a new Category to an User
        /// </summary>
        /// <param name="newUserCategory"></param>
        /// <returns></returns>
        [HttpPost()]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult AddUserCategory(UserCategory newUserCategory)
        {
            try
            {
                _userCategoryService.AddUserCategory(newUserCategory);

            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException postgresException)
                {
                    if (postgresException.SqlState == "23505")
                    {
                        return StatusCode(409);
                    }
                    _logger.LogError("Error in adding user category", ex);
                    return StatusCode(500);
                }
            }
            return Ok();
        }
    }

}
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
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        //Injecting Service with controller actions
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        /// <summary>
        /// Returns User information (@see UserView) from a specific User.Id
        /// </summary>
        /// <param name="id">Id (primary key on the DB) of the User</param>
        /// <returns>UserView</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<UserView> Get(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            UserView userView = new UserView(user);
            return userView;
        }

        /// <summary>
        /// Adds a new user account to the DB
        /// </summary>
        /// <param name="userInformation"></param>
        /// <returns>UserView</returns>
        [HttpPost()]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserView> CreateUser([FromBody] User userInformation)
        {
            User preparedUser = _userService.PreparesNewUser(userInformation);
            
            try
            {
                _userService.AddUser(preparedUser);
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException postgresException)
                {
                    if (postgresException.SqlState == "23505")
                    {
                        return Conflict();
                    }
                    else
                    {
                        return StatusCode(500);
                    }
                }
            }
            return new UserView(preparedUser);
        }

        /// <summary>
        /// Returns a StatusCode depending if the user information is correct to Login or not
        /// </summary>
        /// <param name="userInformation"></param>
        /// <returns>StatusCode</returns>
        [HttpGet("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<UserView> CheckLogin([FromBody] User userInformation)
        {
            // First we verify if the user exists and if not we return error code 401
            var userDb = _userService.GetUserByUsername(userInformation.Username);
            if (userDb == null)
            {
                return Unauthorized();
            }
            if(_userService.CheckPassword(userInformation.Password, userDb))
            {
                return new UserView(userDb);
            }
            return Unauthorized();
        }

        /// <summary>
        /// Updates any of the User attribues in the DB if password is correct
        /// </summary>
        /// <param name="updateUser"></param>
        /// <returns>Updated User information</returns>
        [HttpPost("edit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<UserView> UpdateUser([FromBody] UpdateUser updateUser)
        {
            // First we check if the user exists
            var userDb = _userService.GetUserById(updateUser.Id);
            if (userDb == null)
            {
                return StatusCode(500);
            }
            // We verify that the password is currect
            if (!_userService.CheckPassword(updateUser.Password, userDb))
            {
                return Unauthorized();
            }
            try
            {
                _userService.UpdateUser(updateUser.Id, updateUser.NewUserInformation);
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException postgresException)
                {
                    return StatusCode(500);
                }
            }

            return new UserView(userDb);
        }
    }
}

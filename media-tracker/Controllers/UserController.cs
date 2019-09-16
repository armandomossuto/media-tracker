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
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;

namespace media_tracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class UserController : ControllerBase
    {
        //Injecting Services
        private readonly IUserService _userService;
        private readonly IUserTokenService _userTokenService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IUserTokenService userTokenService, ILogger<UserController> logger)
        {
            _userService = userService;
            _userTokenService = userTokenService;
            _logger = logger;
        }

        public string RefreshTokenCookieKey = "media-tracker-refresh";

        /// <summary>
        /// Returns User information (@see UserView) from a specific User.Id
        /// </summary>
        /// <param name="id">Id (primary key on the DB) of the User</param>
        /// <returns>UserView</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserView>> GetUserInformation(int id)
        {
            var user = await _userService.GetUserById(id);
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
        [AllowAnonymous]
        [HttpPost()]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserLoginView>> CreateUser([FromBody] User userInformation)
        {
            User preparedUser = _userService.PreparesNewUser(userInformation);

            try
            {
                await _userService.AddUser(preparedUser);
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
                        _logger.LogError("Error when adding new user to the DB", ex);
                        return StatusCode(500);
                    }
                }
            }
            UserView userView = new UserView(preparedUser);
            string accessToken = _userTokenService.GenerateUserAccessToken(userView.Id);
            UserTokenView userTokenView = new UserTokenView(userView.Id, accessToken);

            string refreshToken = await _userTokenService.GenerateUserRefreshToken(userView.Id);
            Response.Cookies.Append(
              RefreshTokenCookieKey,
              refreshToken,
              new CookieOptions()
              {
                  Path = "/",
                  HttpOnly = true,
              });

            _logger.LogInformation("Succesfully created user {username}", userView.Username);
            return new UserLoginView(userView, userTokenView);
            }

        /// <summary>
        /// Returns a StatusCode depending if the user information is correct to Login or not
        /// </summary>
        /// <param name="userInformation"></param>
        /// <returns>StatusCode</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserLoginView>> CheckLogin([FromBody] User userInformation)
        {
            // First we verify if the user exists and if not we return error code 401
            var userDb = await _userService.GetUserByUsername(userInformation.Username);
            if (userDb == null)
            {
                return Unauthorized();
            }
            if(_userService.CheckPassword(userInformation.Password, userDb))
            {
                string accessToken = _userTokenService.GenerateUserAccessToken(userDb.Id);
                UserTokenView userTokenView = new UserTokenView(userDb.Id, accessToken);
       
                string refreshToken = await _userTokenService.GenerateUserRefreshToken(userDb.Id);
                Response.Cookies.Append(
                    RefreshTokenCookieKey,
                    refreshToken,
                    new CookieOptions()
                    {
                        Path = "/",
                        HttpOnly = true,
                    });

                UserView userView = new UserView(userDb);
                _logger.LogInformation("Succesfull login from user {username}", userView.Username);
                return new UserLoginView(userView, userTokenView);
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
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserView>> UpdateUser([FromBody] UpdateUser updateUser)
        {
            // First we check if the user exists
            var userDb = await _userService.GetUserById(updateUser.Id);
            if (userDb == null)
            {
                return StatusCode(500);
            }
            // We verify that the password is currect
            if (!_userService.CheckPassword(updateUser.Password, userDb))
            {
                return StatusCode(403);
            }
            try
            {
                await _userService.UpdateUser(updateUser.Id, updateUser.NewUserInformation);
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException)
                {
                    return StatusCode(409);
                }
                _logger.LogError("Error when updating user to the DB", ex);
            }

            _logger.LogInformation("Succesfully updated user {username}", userDb.Username);
            return new UserView(userDb);
        }

        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("refresh")]
        public async Task<ActionResult<UserTokenView>> RefreshTokens([FromBody] UserTokenView userTokenView)
        {
            try
            {
                string refreshToken = Request.Cookies[RefreshTokenCookieKey];
                Tokens newTokens = await _userTokenService.RefreshTokens(refreshToken, userTokenView.AccessToken);
                Response.Cookies.Append(
                    RefreshTokenCookieKey,
                    refreshToken,
                    new CookieOptions()
                    {
                        Path = "/",
                        HttpOnly = true,
                    });
                _logger.LogInformation("Succesfully refreshed tokens for user {username}", userTokenView.UserId);
                return newTokens.UserTokenView;
            }
            catch (Exception ex)
            {
                if(ex.InnerException is SecurityTokenException)
                {
                    return Unauthorized();
                }
                _logger.LogError("Error when refreshing tokens", ex);
                return StatusCode(500);
            }
        }
    }
}

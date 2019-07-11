using System;
using System.Data.SqlClient;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Manages the Actions for the Users Model/Controller
///
namespace media_tracker.Controllers
{
    public interface IUsersService
    {
        ActionResult<Users> GetUser(int id);
        ActionResult<int> AddUser(Users userInformation);
    }

    public class UsersService : IUsersService
    {
        private readonly MediaTrackerContext _context;

        public UsersService(MediaTrackerContext _context)
        {
            this._context = _context;
        }

        /// <summary>
        /// Returns a user information from the DB from a given ID
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <returns> User information </returns>
        public ActionResult<Users> GetUser(int id) =>
            _context.Users.Find(id);

        /// <summary>
        /// Adds a new user to the DB if everything is correct
        /// </summary>
        /// <param name="userInformation">User Information</param>
        /// <returns> Status code with the result of the operatioj </returns>
        public ActionResult<int> AddUser(Users userInformation)
        {
            // Generating the salt for hashing the password
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hashing the password
            string hashedPassword = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: userInformation.Password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            userInformation.Password = hashedPassword;
            userInformation.Salt = salt;

            // Adding the new user to the DB
            _context.Users.Add(userInformation);

            var result = StatusCodes.Status201Created;
            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                // Handling if the username or the email, which have unique constraints in the DB
                // have already been created
                if (ex.InnerException is Npgsql.PostgresException postgresException)
                {
                    if (postgresException.SqlState == "23505")
                    {
                        result = StatusCodes.Status409Conflict;
                    }
                    else
                    {
                        result = StatusCodes.Status500InternalServerError;
                    }

                }
            }
            
            return result;
        }
    }
}

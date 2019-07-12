using System;
using System.Security.Cryptography;
using media_tracker.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the Users Model/Controller
    /// </summary>
    public interface IUserService
    {
        User GetUser(int id);
        User PreparesUser(User userInformation);
        void AddUser(User userInformation);
        Boolean CheckPassword(User userInformation, User UserDb);
    }

    public class UserService : IUserService
    {
        private readonly MediaTrackerContext _context;

        public UserService(MediaTrackerContext _context)
        {
            this._context = _context;
        }

        /// <summary>
        /// Returns a user information from the DB from a given ID
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <returns> User information </returns>
        public User GetUser(int id) =>
            _context.Users.Find(id);

        /// <summary>
        /// Hash user password with generated salt
        /// </summary>
        /// <param name="userInformation"></param>
        /// <returns> User information ready to be stored on the DB</returns>
        public User PreparesUser(User userInformation)
        {
            // Generating the salt for hashing the password
            byte[] salt = GeneratesSalt();

            // Hashing the password
            string hashedPassword = HashPassword(userInformation.Password, salt);

            userInformation.Password = hashedPassword;
            userInformation.Salt = salt;

            // Creation and Modification dates
            userInformation.CreationDate = userInformation.ModificationDate = DateTime.Now;

            return userInformation;
        }

        /// <summary>
        /// Adds a new user to the DB
        /// </summary>
        /// <param name="userInformation">User Information</param>
        public void AddUser(User userInformation)
        {
            // Adding the new user to the DB
            _context.Users.Add(userInformation);
            _context.SaveChanges();
        }

        /// <summary>
        /// Checks if User password (not hashed) matches hashed password from DB
        /// </summary>
        /// <param name="userInformation">User information with password not hashed</param>
        /// <param name="userDb">Data from the DB</param>
        /// <returns>Whether or not password is correct</returns>
        public Boolean CheckPassword(User userInformation, User userDb)
        {
                return HashPassword(userInformation.Password, userDb.Salt) == userDb.Password;
        }

        /// <summary>
        /// Hashes a password with the given salt
        /// </summary>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        private String HashPassword(string password, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }

        /// <summary>
        /// Generates a random salt
        /// </summary>
        /// <returns>Random salt</returns>
        private byte[] GeneratesSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return salt;
        }
    }
}

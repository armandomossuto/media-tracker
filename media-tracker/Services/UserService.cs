using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using media_tracker.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the Users Model/Controller
    /// </summary>
    public interface IUserService
    {
        Task<User> GetUserById(int id);
        Task<User> GetUserByUsername(string username);
        User PreparesNewUser(User userInformation);
        Task AddUser(User userInformation);
        Task UpdateUser(int id, User userInfomation);
        Boolean CheckPassword(string password, User UserDb);
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
        public async Task<User> GetUserById(int id) =>
            await _context.Users.FindAsync(id);

        /// <summary>
        /// Returns a user information from the DB from a given Username
        /// </summary>
        /// <param name="username"></param>
        /// <returns> User information </returns>
        public async Task<User> GetUserByUsername(string username) =>
            await _context.Users.SingleOrDefaultAsync(c => c.Username == username);

        /// <summary>
        /// Hash user password with generated salt
        /// </summary>
        /// <param name="userInformation"></param>
        /// <returns> User information ready to be stored on the DB</returns>
        public User PreparesNewUser(User userInformation)
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
        public async Task AddUser(User userInformation)
        {
            // Adding the new user to the DB
            await _context.Users.AddAsync(userInformation);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Updates New User Properties in DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newUserInformation"></param>
        public async Task UpdateUser(int id, User newUserInformation)
        {
            User user = await _context.Users.FindAsync(id);
            if(newUserInformation.Password != null)
            {
                newUserInformation.Salt = GeneratesSalt();
                newUserInformation.Password = HashPassword(newUserInformation.Password, newUserInformation.Salt);
            }
            newUserInformation.ModificationDate = DateTime.Now;
            user.UpdateExistingUser(newUserInformation);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Checks if User password (not hashed) matches hashed password from DB
        /// </summary>
        /// <param name="password">Password not hashed</param>
        /// <param name="userDb">Data from the DB</param>
        /// <returns>Whether or not password is correct</returns>
        public Boolean CheckPassword(string password, User userDb)
        {
                return HashPassword(password, userDb.Salt) == userDb.Password;
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

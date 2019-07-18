using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using media_tracker.Helpers;
using media_tracker.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the Actions for the Users Model/Controller
    /// </summary>
    public interface IUserService
    {
        User GetUserById(int id);
        User GetUserByUsername(string username);
        string GeneratesUserToken(int id);
        User PreparesNewUser(User userInformation);
        void AddUser(User userInformation);
        void UpdateUser(int id, User userInfomation);
        Boolean CheckPassword(string password, User UserDb);
    }

    public class UserService : IUserService
    {
        private readonly MediaTrackerContext _context;

        private readonly AppSettings _appSettings;

        public UserService(MediaTrackerContext _context, IOptions<AppSettings> appSettings)
        {
            this._context = _context;
            _appSettings = appSettings.Value;
        }

        

        /// <summary>
        /// Returns a user information from the DB from a given ID
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <returns> User information </returns>
        public User GetUserById(int id) =>
            _context.Users.Find(id);

        /// <summary>
        /// Returns a user information from the DB from a given Username
        /// </summary>
        /// <param name="username"></param>
        /// <returns> User information </returns>
        public User GetUserByUsername(string username) =>
            _context.Users.SingleOrDefault(c => c.Username == username);

        /// <summary>
        /// Generates a token for an user session
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string GeneratesUserToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.TokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userId.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

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
        public void AddUser(User userInformation)
        {
            // Adding the new user to the DB
            _context.Users.Add(userInformation);
            _context.SaveChanges();
        }

        /// <summary>
        /// Updates New User Properties in DB
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newUserInformation"></param>
        public void UpdateUser(int id, User newUserInformation)
        {
            User user = _context.Users.Find(id);
            if(newUserInformation.Password != null)
            {
                newUserInformation.Salt = GeneratesSalt();
                newUserInformation.Password = HashPassword(newUserInformation.Password, newUserInformation.Salt);
            }
            newUserInformation.ModificationDate = DateTime.Now;
            user.UpdateExistingUser(newUserInformation);
            _context.SaveChanges();
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace media_tracker.UsersControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MediaTrackerContext _context;

        public UsersController(MediaTrackerContext _context)
        {
            this._context = _context;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<Users> Get(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }


        [HttpPost()]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public void Post([FromBody] Users userInformation)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            string password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: userInformation.Password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));
            userInformation.Password = password;
            userInformation.Salt = salt;
            Console.WriteLine("Password is {0}", userInformation.Password);
            _context.Users.Add(userInformation);
            _context.SaveChanges();
        }
    }
}

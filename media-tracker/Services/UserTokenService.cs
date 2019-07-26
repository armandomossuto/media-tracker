using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using media_tracker.Helpers;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages User Token generation/validation methods
    /// We are using a JWT with short expiration as an access token, which is the one used 
    /// to grant access to most of the API endpoints
    /// When it expires, we use a random string refresh token, which is stores in the DB, to generate a new JWT
    /// </summary>
    public interface IUserTokenService
    {
        string GenerateUserAccessToken(int userId);
        string GenerateUserRefreshToken(int userId);
        UserTokenView RefreshTokens(string refreshToken, string accessToken);
    }

    public class UserTokenService : IUserTokenService
    {
        // Injecting DB context
        private readonly MediaTrackerContext _context;

        // Injecting App settings
        private readonly AppSettings _appSettings;

        public UserTokenService(MediaTrackerContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
        }

        /// <summary>
        /// Generates an access token for an user session
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string GenerateUserAccessToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.TokenKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, userId.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Generates a RefreshToken and stores it in the DB
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>RefreshToken</returns>
        public string GenerateUserRefreshToken(int userId)
        {
            // Using a random number to generate the token
            var randomNumber = new byte[32];
            RandomNumberGenerator.Create().GetBytes(randomNumber);
            string token = Convert.ToBase64String(randomNumber);

            UserToken dbUserToken = _context.UsersTokens.Find(userId);

            // Depending if we already have an entry or not in the DB we will update or add it
            if (dbUserToken != null)
            {
                dbUserToken.RefreshToken = token;
            }
            else
            {
                _context.UsersTokens.Add(new UserToken { UserId = userId, RefreshToken = token });
            }

            _context.SaveChanges();

            // Returns the token, because we will send it back to the client side
            return token;
        }

        /// <summary>
        /// Returns the refresh token stored in the DB for a specific userId
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        private string GetRefreshTokenFromDb(int userId)
        {
            return _context.UsersTokens.Find(userId).RefreshToken;
        }

        /// <summary>
        /// Gets principal from an expired token in order to disect it for generating new tokens
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.TokenKey)),
                ValidateLifetime = false
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            ClaimsPrincipal principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (!(securityToken is JwtSecurityToken jwtSecurityToken) || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        /// <summary>
        /// Refresh tokens when the current access token has expired
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <param name="accessToken"></param>
        public UserTokenView RefreshTokens(string refreshToken, string accessToken)
        {
            ClaimsPrincipal principal = GetPrincipalFromExpiredToken(accessToken);
            int userId = Convert.ToInt32(principal.Identity.Name);
            string savedRefreshToken = GetRefreshTokenFromDb(userId);
            if (savedRefreshToken != refreshToken)
                throw new SecurityTokenException("Invalid Refresh Token");

            string newAccessToken = GenerateUserAccessToken(userId);
            string newRefreshToken = GenerateUserRefreshToken(userId);
            return new UserTokenView(userId, newAccessToken);

        }
    }
}

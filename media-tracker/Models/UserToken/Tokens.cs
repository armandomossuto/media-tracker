using System;
using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    /// <summary>
    /// Class used for keeping both the Acess Token and Refresh Tokens in the same place
    /// This is not meant to be used for the DB or the client, and only for the middleware services 
    /// </summary>
    public class Tokens
    {

        public string RefreshToken { get; set; }
        public UserTokenView UserTokenView { get; set; }

        public Tokens(int userId, string refreshToken, string accessToken)
        {
            UserTokenView = new UserTokenView(userId, accessToken);
            RefreshToken = refreshToken;
        }
    }
}

using System;
namespace media_tracker.Models
{
    public class UserTokenView
    {
        public string RefreshToken { get; set; }

        public string AccessToken { get; set; }

        public UserTokenView(string refreshToken, string accessToken)
        {
            RefreshToken = refreshToken;
            AccessToken = accessToken;
        }
    }
}

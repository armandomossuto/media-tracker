using System;
namespace media_tracker.Models
{
    public class UserTokenView
    {
        public string AccessToken { get; set; }
        public int UserId { get; set; }

        public UserTokenView(int userId, string accessToken)
        {
            AccessToken = accessToken;
            UserId = userId;
        }
    }
}

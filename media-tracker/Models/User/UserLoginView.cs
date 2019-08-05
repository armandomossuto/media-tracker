using System;
namespace media_tracker.Models
{
    public class UserLoginView
    {
        public UserView UserInformation { get; set; }
        public UserTokenView UserToken { get; set; }

        public UserLoginView(UserView userView, UserTokenView userToken)
        {
            UserInformation = userView;
            UserToken = userToken;
        }
    }
}

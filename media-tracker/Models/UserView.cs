using System;
namespace media_tracker.Models
{
    public class UserView
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }

        /// <summary>
        /// Creates a new userView object from user object
        /// UserView contains the information from user that we desired to send to the client
        /// </summary>
        /// <param name="user"></param>
        public UserView(User user)
        {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
            CreationDate = user.CreationDate;
            ModificationDate = user.ModificationDate;
        }
    }
}

using System;
namespace media_tracker.Models
{
    public class UpdateUser
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public User NewUserInformation { get; set; }
    }
}

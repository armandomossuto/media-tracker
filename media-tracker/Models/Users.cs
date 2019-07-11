using System;
namespace media_tracker.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ModificationTime { get; set; }
        private string Password { get; set; }
        public string Salt { get; set; }
    }
}

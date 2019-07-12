using System;
namespace media_tracker.Models
{
    /// <summary>
    /// User class as used in the DB to store the user information
    /// </summary>
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? ModificationDate { get; set; }
        public string Password { get; set; }
        public byte[] Salt { get; set; }
    }
}

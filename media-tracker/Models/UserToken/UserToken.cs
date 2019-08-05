using System;
using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    public class UserToken
    {
        [Key]
        public int UserId { get; set; }

        public string RefreshToken { get; set; }

    }
}

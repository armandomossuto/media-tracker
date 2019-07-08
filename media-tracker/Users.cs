using System;
using System.Collections.Generic;

namespace media_tracker
{
    public partial class Users
    {
        public byte[] Salt;
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

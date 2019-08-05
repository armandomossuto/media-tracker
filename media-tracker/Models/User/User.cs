using System;
using System.Reflection;

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

        /// <summary>
        /// Use to update User with another User Objec
        /// Only updates non null properties and never updates Id, which is primary Key in DB
        /// </summary>
        /// <param name="newUserInformation"></param>
        public void UpdateExistingUser(User newUserInformation)
        {
            Type type = typeof(User);
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var newValue = property.GetValue(newUserInformation);
                if (newValue != null && property.Name != "Id")
                {
                    property.SetValue(this, newValue);
                }
            }
        }
    }
 
}
using System;
using System.Reflection;

namespace media_tracker.Models
{
    public class UserItem
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public ItemState State { get; set; }


        public UserItem()
        {
            State = ItemState.NotSet;
        }

        public void SetState(ItemState state)
        {
            this.State = state;
        }

        /// <summary>
        /// Updates Rating or State on a userItem
        /// </summary>
        /// <param name="newUserItemInformation"></param>
        public void UpdateExistingUserItem(UserItem newUserItemInformation)
        {
            Type type = typeof(UserItem);
            PropertyInfo[] properties = type.GetProperties();
            foreach (PropertyInfo property in properties)
            {
                var newValue = property.GetValue(newUserItemInformation);
                // We only allow user to modify state or rating properties, and if they are not null
                if (newValue != null && (property.Name == "Rating" || property.Name == "State"))
                {
                    property.SetValue(this, newValue);
                }
            }
        }

    }
}
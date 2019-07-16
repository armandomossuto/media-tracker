using System;
namespace media_tracker.Models
{
    public class UserItemView : Item
    {
        public int Rating { get; set; }
        public ItemState State { get; set; }

        public UserItemView(UserItem userItem, Item item)
        {
            Id = item.Id;
            CategoryId = item.CategoryId;
            Name = item.Name;
            Description = item.Description;
            Rating = userItem.Rating;
            State = userItem.State;
        }
    }
}
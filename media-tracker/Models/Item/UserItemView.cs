using System;
namespace media_tracker.Models
{
    /// <summary>
    /// Class for the FE item overview
    /// </summary>
    public class UserItemView : Item
    {
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public int Rating { get; set; }
        public ItemState State { get; set; }
    }
}
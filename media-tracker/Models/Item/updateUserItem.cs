using System;
namespace media_tracker.Models
{
    public class UpdateUserItem
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public UserItem NewUserItemInformation { get; set; }
    }
}

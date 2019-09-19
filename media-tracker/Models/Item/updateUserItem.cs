using System;
namespace media_tracker.Models
{
    public class UpdateUserItem
    {
        public int UserId { get; set; }
        public int ItemId { get; set; }
        public NewUserItemProperties NewUserItemInformation { get; set; }
    }

    public class NewUserItemProperties
    {
        public int? Rating { get; set; }
        public ItemState? State { get; set; }
    }
}

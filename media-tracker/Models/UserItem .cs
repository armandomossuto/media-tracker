using System;
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

    }
}
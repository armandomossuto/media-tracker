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
        public void UpdateExistingUserItem(NewUserItemProperties newUserItemInformation)
        {
            if (newUserItemInformation.Rating != null)
            {
                Rating = newUserItemInformation.Rating.GetValueOrDefault();
            }
            if (newUserItemInformation.State != null)
            {
                State = newUserItemInformation.State.GetValueOrDefault();
            }
        }
    }
}
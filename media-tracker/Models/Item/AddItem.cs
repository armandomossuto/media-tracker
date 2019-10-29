using System;
using System.Linq;

namespace media_tracker.Models
{
    /// <summary>
    /// Class for the body request of adding a new Item API
    /// </summary>
    public class AddItem
    {
        public NewItem Item { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }

        /// <summary>
        /// The new Item can be any of our different types of Items
        /// </summary>
        public class NewItem : MovieView
        {

        }

        /// <summary>
        /// To generate a Movie Item
        /// </summary>
        /// <param name="itemId"></param>
        /// <returns></returns>
        public Movie ToMovie(int itemId) =>
            new Movie
            {
                ItemId = itemId,
                Title = this.Item.Title,
                Description = this.Item.Description,
                ExternalId = this.Item.ExternalId,
                Genres = this.Item.Genres.Select(g => g.Id).ToList(),
                ImageUrl = this.Item.ImageUrl,
                OriginalLanguage = this.Item.OriginalLanguage,
                ReleaseDate = this.Item.ReleaseDate
            };

        /// <summary>
        /// To generate an Item
        /// </summary>
        /// <returns></returns>
        public Item ToItem() =>
            new Item
            {
                CategoryId = this.CategoryId
            };
    }
}

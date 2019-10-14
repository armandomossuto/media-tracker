using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    /// <summary>
    /// Movie entity. For items with Movies category
    /// </summary>
    public class Movie : MovieExternal
    {
        [Key]
        public int ItemId { get; set; }
        public new int ExternalId { get; set; }
        public new string Description { get; set; }
        public new string ImageUrl { get; set; }
        public new string OriginalLanguage { get; set; }
        public new string ReleaseDate { get; set; }
        public new List<int> Genres { get; set; }

        /// <summary>
        /// Converts from Movie class to MovieView
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public new MovieView ToMovieView(MediaTrackerContext context) =>
            new MovieView
            {
                ExternalId = this.ExternalId,
                Title = this.Title,
                Description = this.Description,
                ImageUrl = this.ImageUrl,
                OriginalLanguage = this.OriginalLanguage,
                ReleaseDate = this.ReleaseDate,
                Genres = GetMovieGenres(this.Genres, context),
            };
    }

}

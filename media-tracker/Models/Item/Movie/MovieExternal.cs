using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace media_tracker.Models
{
    /// <summary>
    /// Class For Movie Results from external API
    /// </summary>
    public class MovieExternal
    {
        [JsonProperty(PropertyName = "id")]
        public int ExternalId { get; set; }

        public string Title { get; set; }

        [JsonProperty(PropertyName = "overview")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "poster_path")]
        public string ImageUrl { get; set; }

        [JsonProperty(PropertyName = "genre_ids")]
        public List<int> Genres { get; set; }

        [JsonProperty(PropertyName = "original_language")]
        public string OriginalLanguage { get; set; }

        [JsonProperty(PropertyName = "release_date")]
        public string ReleaseDate { get; set; }

        /// <summary>
        /// Convert from MovieResult to the class used in the FE
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public MovieView ToMovieView(MediaTrackerContext context) =>
            new MovieView
            {
                ExternalId = this.ExternalId,
                Title = this.Title,
                Description = this.Description,
                ImageUrl = GenerateImageUrl(),
                OriginalLanguage = this.OriginalLanguage,
                ReleaseDate = this.ReleaseDate,
                Genres = GetMovieGenres(this.Genres, context),
            };

        /// <summary>
        /// Gets the movie genres from a list of genre ids
        /// </summary>
        /// <param name="genreIds"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public List<MovieGenre> GetMovieGenres(List<int> genreIds, MediaTrackerContext context)
        {
            return (from genre in context.MovieGenres
                    where genreIds.Contains(genre.Id)
                    select genre).ToList();
        }

        public string GenerateImageUrl()
        {
            // If we don't have a poster URL, we use our placeholder
            if (this.ImageUrl != null)
            {
                return "https://image.tmdb.org/t/p/w200" + this.ImageUrl;
            }
            else
            {
                return "/images/image-not-available.png";
            }
        }


    }
}

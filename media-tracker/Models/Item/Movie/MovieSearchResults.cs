using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace media_tracker.Models
{
    public class MovieSearchResults
    {
        public List<MovieResult> Results { get; set; }
    }

    public class MovieResult
    {
        [JsonProperty(PropertyName = "id")]
        public int ExternalId { get; set; }

        public string Title { get; set; }

        [JsonProperty(PropertyName = "overview")]
        public string Description { get; set; }

        [JsonProperty(PropertyName = "poster_path")]
        public string ImageUrl{ get; set; }

        [JsonProperty(PropertyName = "genre_ids")]
        public List<int> Genres { get; set; }

        [JsonProperty(PropertyName = "original_language")]
        public string OriginalLanguage { get; set; }

        [JsonProperty(PropertyName = "release_date")]
        public string ReleaseDate { get; set; }
    }

    public class MovieSearchView
    {
        public int ExternalId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string OriginalLanguage { get; set; }
        public string ReleaseDate { get; set; }
        public List<MovieGenre> Genres { get; set; }

        public MovieSearchView(MovieResult movieResult, MediaTrackerContext context)
        {
            ExternalId = movieResult.ExternalId;
            Title = movieResult.Title;
            Description = movieResult.Description;
            // If we don't have a poster URL, we use our placeholder
            if (movieResult.ImageUrl != null)
            {
                ImageUrl = "https://image.tmdb.org/t/p/w200" + movieResult.ImageUrl;
            }
            else
            {
                ImageUrl = "/images/image-not-available.png";
            }
            OriginalLanguage = movieResult.OriginalLanguage;
            ReleaseDate = movieResult.ReleaseDate;

            // We must retrieve the list of genres names from the DB
            Genres = GetMovieGenres(movieResult.Genres, context);
        }

        /// <summary>
        /// Gets the movie genres from a list of genre ids
        /// </summary>
        /// <param name="genreIds"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public List<MovieGenre> GetMovieGenres(List<int> genreIds, MediaTrackerContext context)
        {
            return  (from genre in context.MovieGenres
             where genreIds.Contains(genre.Id)
             select genre).ToList();
        }
    }
}

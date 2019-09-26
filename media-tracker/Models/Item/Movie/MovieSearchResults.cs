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
        public string PosterUrl{ get; set; }

        [JsonProperty(PropertyName = "genre_ids")]
        public List<int> Genres { get; set; }

        [JsonProperty(PropertyName = "original_language")]
        public string OriginalLanguage { get; set; }

        [JsonProperty(PropertyName = "release_date")]
        public string ReleaseDate { get; set; }
    }

    public class MovieSearchView : MovieResult
    {
        public new List<MovieGenre> Genres { get; set; }

        public MovieSearchView(MovieResult movieResult, MediaTrackerContext context)
        {
            ExternalId = movieResult.ExternalId;
            Title = movieResult.Title;
            Description = movieResult.Description;
            PosterUrl = movieResult.PosterUrl;
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

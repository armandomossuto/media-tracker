using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
        public async Task<MovieView> ToMovieView(MediaTrackerContext context) =>
            new MovieView
            {
                ItemId = await GetItemId(context),
                ExternalId = this.ExternalId,
                Title = this.Title,
                Description = this.Description,
                ImageUrl = GenerateImageUrl(),
                OriginalLanguage = this.OriginalLanguage,
                ReleaseDate = this.ReleaseDate,
                Genres = await GetMovieGenres(context),
            };

        /// <summary>
        /// Gets the movie genres from a list of genre ids
        /// </summary>
        /// <param name="_context"></param>
        /// <returns></returns>
        public async Task<List<MovieGenre>> GetMovieGenres(MediaTrackerContext _context)
        {
            // If the list of genres is empty, there is no need to query the DB
            if (this.Genres.Count == 0)
            {
                return null;
            }

            return await (from genre in _context.MovieGenres
                    where this.Genres.Contains(genre.Id)
                    select genre).ToListAsync();
        }

        /// <summary>
        /// Generates the complete poster image URL from the external result
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// For a movie external result, checks if it is already on the DB and returns itemId if it is
        /// </summary>
        /// <param name="_context"></param>
        /// <returns></returns>
        public async Task<int?> GetItemId(MediaTrackerContext _context)
        {
            var movie = await _context.Movies.SingleOrDefaultAsync(m => m.ExternalId == this.ExternalId);
            return movie?.ItemId;
        }
    }
}

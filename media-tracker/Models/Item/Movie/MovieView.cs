using System.Collections.Generic;

namespace media_tracker.Models
{
    /// <summary>
    /// Movie Search Result for the FE
    /// </summary>
    public class MovieView
    {
        public int ExternalId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string OriginalLanguage { get; set; }
        public string ReleaseDate { get; set; }
        public List<MovieGenre> Genres { get; set; }
    }
}

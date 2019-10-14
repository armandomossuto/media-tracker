using System.Collections.Generic;

namespace media_tracker.Models
{
    /// <summary>
    /// List of movie results from external API
    /// </summary>
    public class MovieExternalResults
    {
        public List<MovieExternal> Results { get; set; }
    }

}

using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    public class Movie: MovieResult
    {
        [Key]
        public int ItemId { get; set; }
    }

}

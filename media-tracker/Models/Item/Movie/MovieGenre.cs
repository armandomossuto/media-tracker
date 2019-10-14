using System;
using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    /// <summary>
    /// Entity for the genre of the movies items
    /// </summary>
    public class MovieGenre
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace media_tracker.Models
{
    public class MovieGenre
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

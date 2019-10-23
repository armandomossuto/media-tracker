using System;
namespace media_tracker.Models
{
    public class ItemSearchRequest
    {
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string SearchTerm { get; set; }
        public int Page { get; set; }
    }
}

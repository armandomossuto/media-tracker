using System;
namespace media_tracker.Models
{
    /// <summary>
    /// Relationship table for linking an User to a Category
    /// </summary>
    public class UserCategory
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using Moq;

namespace media_tracker.Tests.MockedData
{
    /// <summary>
    /// For easily storing and having access to both the mocked context and set
    /// </summary>
    /// <typeparam name="Model"></typeparam>
    public class MockedContext<Model> where Model : class
    {
        public Mock<DbSet<Model>> Set  { get; set; }
        public Mock<MediaTrackerContext> Context { get; set; }
    }
}

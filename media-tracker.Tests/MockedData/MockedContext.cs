using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Tests.MockedData
{
    /// <summary>
    /// For easily storing and having access to both the mocked context and set
    /// </summary>
    public class MockedContext
    {
        public MediaTrackerContext Context { get; set; }

        /// <summary>
        /// We are using SqlLite in memory DB for the tests
        /// </summary>
        /// <param name="mockedData"></param>
        public MockedContext(MockedDbData mockedData)
        {
            // Using in memory DB
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder<MediaTrackerContext>()
                .UseSqlite(connection)
                .Options;

            // Create an instance of the db context
            var _context = new MediaTrackerContext(options);
           
            _context.Database.EnsureCreated();

            // Adding the mocked data
            _context.Users.AddRange(mockedData.Users);
            _context.UsersTokens.AddRange(mockedData.UsersTokens);
            _context.Categories.AddRange(mockedData.Categories);
            _context.UsersCategories.AddRange(mockedData.UsersCategories);
            _context.Items.AddRange(mockedData.Items);
            _context.UsersItems.AddRange(mockedData.UsersItems);
            _context.MovieGenres.AddRange(mockedData.MovieGenres);
            _context.Movies.AddRange(mockedData.Movies);
            _context.SaveChanges();

            Context = _context;
        }
    }
}

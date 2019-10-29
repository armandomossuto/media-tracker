using System;
using System.Linq;
using media_tracker.Models;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Tests.MockedData
{
    public class MockedMediaTrackerContext : MediaTrackerContext
    {
        public MockedMediaTrackerContext(DbContextOptions<MediaTrackerContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// In production we are using a postgrsql DB that allow us to store a collection of integer
        /// In unit tests, we are using sqlite in memory DB, so we need to map this property to a string
        // for the unit tests to pass
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Movie>()
            .Property(e => e.Genres)
            .HasConversion(
                v => string.Join(',', v.ToString()),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToList()
                );

        }
    }

    /// <summary>
    /// For easily storing and having access to both the mocked context and set
    /// </summary>
    public class MockedContext

    {
        public MediaTrackerContext Context { get; set; }
        public SqliteConnection Connection { get; set; }

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

            try
            {
                // Create an instance of the db context
                var _context = new MockedMediaTrackerContext(options);
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
                Connection = connection;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        /// <summary>
        /// Dispose the Database to ensure that it will be clean for the next instance
        /// </summary>
        public void DisposeContext()
        {
            Context.Database.EnsureDeleted();
            Connection.Close();
        }
    }
}

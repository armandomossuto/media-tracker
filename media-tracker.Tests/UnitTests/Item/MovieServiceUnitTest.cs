using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Newtonsoft.Json;
using Xunit;

namespace media_tracker.Tests.UnitTests
{
    public class MovieServiceUnitTest
    {
        /// <summary>
        /// Generating the service to test with a mocked context
        /// </summary>
        /// <returns></returns>
        public MovieService GetMockedService(MediaTrackerContext mockContext, string mockedHttpResponseMessage = null)
        {
            var responseMessage = new HttpResponseMessage
            {
                Content = new FakeHttpContent(mockedHttpResponseMessage)
            };
            var messageHandler = new FakeHttpMessageHandler(responseMessage);
            var client = new HttpClient(messageHandler);

            return new MovieService(mockContext, client);
        }

        [Fact]
        public async Task SearchMovieItems()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);

            // Mocking the movie search request response
            MovieExternalResults movieSearchResults = new MovieExternalResults()
            {
                Results = new List<MovieExternal>
                {
                    new MovieExternal
                    {
                        ExternalId = 1,
                        Title = "Movie1",
                        Genres = new List<int> { 12 }
                    },
                    new MovieExternal
                    {
                        ExternalId = 2,
                        Title = "Movie2",
                        Genres = new List<int> { 28 }
                    },
                }
            };

            var mockedHttpResponse = JsonConvert.SerializeObject(movieSearchResults);


            MovieService movieService = GetMockedService(mockedContext.Context, mockedHttpResponse);

            var results = await movieService.SearchMovieItems(2, "Movie", 0);

            // Checking that the results are not empty
            Assert.IsType<List<MovieView>>(results);
            Assert.Equal("Movie1", results[0].Title);

            // Checking that the first result has the correct genre assigned
            Assert.Equal(new List<MovieGenre>() { mockedContext.Context.MovieGenres.Single(g => g.Id == 12) }, results.Find(m => m.Title == "Movie1").Genres);
        }

        [Fact]
        public async Task AddMovieItem()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);

            Movie movie = new Movie
            {
                ItemId = 1,
                ExternalId = 1,
                Title = "Movie1",
                Genres = new List<MovieGenre> { }
            };

            MovieService movieService = GetMockedService(mockedContext.Context);

            await movieService.AddMovieItem(movie);

            // Checking that the new Item was added correctly
            Assert.NotNull(mockedContext.Context.Movies.Single(m => m.ItemId == movie.ItemId & m.ExternalId == movie.ExternalId));
        }

    }
}

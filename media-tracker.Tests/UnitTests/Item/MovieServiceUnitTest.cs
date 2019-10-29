using System;
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

        /// <summary>
        /// Generating a list of movie external results
        /// </summary>
        /// <returns></returns>
        private List<MovieExternal> GenerateMovieExternalList(int total)
        {
            var moviesExternal = new List<MovieExternal>();
            for (int i = 1; i < total; i++)
            {
                moviesExternal.Add(new MovieExternal
                {
                    ExternalId = i,
                    Title = "MovieExternal" + i,
                    Genres = new List<int> { 28 },
                    Description = "",
                    ImageUrl = "",
                    OriginalLanguage = "",
                    ReleaseDate = "",
                });
            }
            return moviesExternal;
        }

        /// <summary>
        /// Generating a list of movie results
        /// </summary>
        /// <returns></returns>
        private List<Movie> GenerateMovieList(int total)
        {
            var movies = new List<Movie>();
            for (int i = 1; i < total; i++)
            {
                movies.Add(new Movie
                {
                    ItemId = i+200,
                    ExternalId = i+2,
                    Title = "Movie" + i,
                    Genres = new List<int> { 28 },
                    Description = "",
                    ImageUrl = "",
                    OriginalLanguage = "",
                    ReleaseDate = "",
                    });
            }
            return movies;
        }

        [Fact]
        public async Task FindMovieByExternalId()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);

            Movie movie = new Movie
            {
                ItemId = 1,
                ExternalId = 5,
                Title = "Movie1",
                Genres = new List<int> { }
            };

            MovieService movieService = GetMockedService(mockedContext.Context);

            await movieService.AddMovieItem(movie);
            var movieInDb = await movieService.FindMovieByExtId(movie.ExternalId);

            // Checking that the new Item was added correctly
            Assert.Equal(movieInDb.Title, movie.Title);


            // Cleaning DB after test
            mockedContext.DisposeContext();
        }

        [Fact]
        public async Task SearchMovieItemsTriggerinExternalRequest()
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

            // Local DB for movies brings less than 10 items, we use the ones from the external request
            MovieService movieService = GetMockedService(mockedContext.Context, mockedHttpResponse);

            var results = await movieService.SearchMovieItems(2, "Movie", 1);

            // Checking that the results are not empty
            Assert.IsType<List<MovieView>>(results);
            Assert.Equal("Movie1", results[0].Title);

            // Cleaning DB after test
            mockedContext.DisposeContext();
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
                Genres = new List<int> { }
            };

            MovieService movieService = GetMockedService(mockedContext.Context);

            await movieService.AddMovieItem(movie);

            // Checking that the new Item was added correctly
            Assert.NotNull(mockedContext.Context.Movies.Single(m => m.ItemId == movie.ItemId & m.ExternalId == movie.ExternalId));


            // Cleaning DB after test
            mockedContext.DisposeContext();
        }

        [Fact]
        public async Task SearchMovieItemsInDB()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);

            // Mocking the movie search request response
            MovieExternalResults movieSearchResults = new MovieExternalResults()
            {
                Results = GenerateMovieExternalList(20),
            };

            // Generating a list of movies and adding it to the DB
            var moviesInDb = GenerateMovieList(50);
            mockedContext.Context.Movies.AddRange(moviesInDb);
            mockedContext.Context.SaveChanges();

            var mockedHttpResponse = JsonConvert.SerializeObject(movieSearchResults);

            MovieService movieService = GetMockedService(mockedContext.Context, mockedHttpResponse);

            // Because there are enough results in the DB matching the search request, we will take them from there
            var results = await movieService.SearchMovieItems(2, "Movie", 1);

            // Checking that the results are the correct type
            Assert.IsType<List<MovieView>>(results);

            // Checking that no results came from external source. Only two of the results contain MovieExternal becuase were added in the previous test
            Assert.DoesNotContain(results, m => m.Title.Contains("MovieExternal"));
            Assert.Equal(20, results.Count(m => m.Title.Contains("Movie")));
            Assert.Contains(results, m => m.ItemId == moviesInDb[9].ItemId);

            // Requesting Page 2
            var results2 = await movieService.SearchMovieItems(2, "Movie", 2);

            Assert.Contains(results2, m => m.ExternalId > 10);

            // Requesting Page 5. Not enough items in DB, we will use external service
            var results3 = await movieService.SearchMovieItems(2, "Movie", 5);
            Assert.Contains(results3, m => m.Title.Contains("MovieExternal"));

            // We add an item to the user, and then we check that it is not coming with searchResults method
            mockedContext.Context.Add(new UserItem()
            {
                ItemId = moviesInDb[9].ItemId,
                UserId = 2
            });
            mockedContext.Context.SaveChanges();

            var results4 = await movieService.SearchMovieItems(2, "Movie", 1);
            Assert.DoesNotContain(results4, m => m.ItemId == moviesInDb[9].ItemId);

            // Cleaning DB after test
            mockedContext.DisposeContext();
        }
    }
}

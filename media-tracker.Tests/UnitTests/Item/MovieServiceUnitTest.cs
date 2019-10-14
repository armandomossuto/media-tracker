﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using media_tracker.Models;
using media_tracker.Services;
using media_tracker.Tests.MockedData;
using Moq;
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
        public MovieService GetMockedService(Mock<MediaTrackerContext> mockContext, string mockedHttpResponseMessage = null)
        {
            var responseMessage = new HttpResponseMessage
            {
                Content = new FakeHttpContent(mockedHttpResponseMessage)
            };
            var messageHandler = new FakeHttpMessageHandler(responseMessage);
            var client = new HttpClient(messageHandler);

            return new MovieService(mockContext.Object, client);
        }

        [Fact]
        public async Task SearchMovieItems()
        {
            // Creating context, data and a new instance of the service that we want to test
            var mockedData = new MockedDbData();
            MockedContext mockedContext = new MockedContext(mockedData);

            // Mocking the movie search request response
            MovieSearchResults movieSearchResults = new MovieSearchResults()
            {
                Results = new List<MovieResult>
                {
                    new MovieResult
                    {
                        ExternalId = 1,
                        Title = "Movie1",
                        Genres = new List<int> { 12 }
                    },
                    new MovieResult
                    {
                        ExternalId = 2,
                        Title = "Movie2",
                        Genres = new List<int> { 28 }
                    },
                }
            };

            var mockedHttpResponse = JsonConvert.SerializeObject(movieSearchResults);


            MovieService movieService = GetMockedService(mockedContext.Context, mockedHttpResponse);

            var results = await movieService.SearchMovieItems("Movie");

            // Checking that the results are not empty
            Assert.IsType<List<MovieSearchView>>(results);
            Assert.Equal("Movie1", results[0].Title);

            // Checking that the first result has the correct genre assigned
            Assert.Equal(new List<MovieGenre>() { mockedData.MovieGenres.Find(g => g.Id == 12) }, results.Find(m => m.Title == "Movie1").Genres);
        }

    }
}
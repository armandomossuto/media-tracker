using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace media_tracker.Services
{
    /// <summary>
    /// Manages the action methods related to Movie items
    /// </summary>
    public interface IMovieService
    {
        Task<List<MovieView>> SearchMovieItems(string searchTerm);
        Task AddMovieItem(Movie movie);
    }

    public class MovieService : IMovieService
    {
        private readonly MediaTrackerContext _context;
        private readonly HttpClient HttpClient;

        public MovieService(MediaTrackerContext _context, HttpClient httpClient = null)
        {
            if (httpClient == null)
            {
                httpClient = new HttpClient();
            }
            this._context = _context;
            HttpClient = httpClient;
        }

        /// <summary>
        /// Returns a list of movies according to the search term
        /// It will either fetch the results from the DB or the external API
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        public async Task<List<MovieView>> SearchMovieItems(string searchTerm)
        {
            // First we check if we have enough results from the Movie Table in local context
            var moviesResultDb = await GetMoviesByTitle(searchTerm);

            if (moviesResultDb.Count() > 10)
            {
                // Converting the results to the view model and sending them to the client
                return moviesResultDb.Select(m => m.ToMovieView(_context)).ToList();
            }
            // If  we don't have enough results from DB, we fetch them from the external API
            var movieExternalResults = await GetMoviesFromExt(searchTerm);
            // Converting the results to the view model and sending them to the client
            return movieExternalResults.Select(m => m.ToMovieView(_context)).ToList();
        }

        /// <summary>
        /// Gets a list of movies from the DB which titles matches the searched term
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        private async Task<List<Movie>> GetMoviesByTitle(string searchTerm) =>
             await (from movie in _context.Movies
                    where movie.Title.Contains(searchTerm)
                    select movie).ToListAsync();

        /// <summary>
        /// Gets a list of movies from the external API which titles matches the searched term
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        private async Task<List<MovieExternal>> GetMoviesFromExt(string searchTerm)
        {
            string urlRequest = $"https://api.themoviedb.org/3/search/movie?api_key=5db2d2b2ae57b67c6d0db0fbebbe22ec&language=en-US&query={searchTerm}&page=1&include_adult=false";
            string jsonResponse = await HttpClient.GetStringAsync(urlRequest);
            return JsonConvert.DeserializeObject<MovieExternalResults>(jsonResponse).Results;
        }

        /// <summary>
        /// Adds a new item to the Movie DB
        /// </summary>
        /// <param name="movie"></param>
        /// <returns></returns>
        public async Task AddMovieItem(Movie movie)
        {
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();
        }
    }
}

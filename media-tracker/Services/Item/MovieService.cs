using System;
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
        Task<List<MovieView>> SearchMovieItems(int userId, string searchTerm, int page);
        Task AddMovieItem(Movie movie);
        Task<Movie> FindMovieByExtId(int externalId);
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
        public async Task<List<MovieView>> SearchMovieItems(int userId, string searchTerm, int page)
        {
            // First we check if we have enough results from the Movie Table in local context
            var moviesResultDb = await GetMoviesByTitleAndNotInUserList(searchTerm, userId, 20, page);
            if (moviesResultDb.Count() > 10)
            {
                // Converting the results to the view model and sending them to the client
                return moviesResultDb.Select(m => m.ToMovieView()).ToList();
            }
            // If  we don't have enough results from DB, we fetch them from the external API
            var movieExternalResults = await GetMoviesFromExt(searchTerm, page);
            // Filtering items already on the userItem
            // Converting the results to the view model and sending them to the client
            var movieExternalResultsTasks = movieExternalResults.Select(m => m.ToMovieView(_context));
            var movieViewResults = (await Task.WhenAll(movieExternalResultsTasks)).ToList();

            // Remove items already on the userItems list
            movieViewResults.RemoveAll(m => IsItemInUsersItems(userId, m.ItemId));
            return movieViewResults;
        }

        /// <summary>
        /// Gets a list of movies from the DB which titles matches the searched term
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        private async Task<List<Movie>> GetMoviesByTitleAndNotInUserList(string searchTerm, int userId, int pageSize, int page) =>
            await _context.Movies
                .Where(m => m.Title.Contains(searchTerm) & !_context.UsersItems.Any(u => u.UserId == userId & u.ItemId == m.ItemId))
                .Skip((pageSize - 1) * (page - 1))
                .Take(pageSize)
                .ToListAsync();

        /// <summary>
        /// Gets a list of movies from the external API which titles matches the searched term
        /// </summary>
        /// <param name="searchTerm"></param>
        /// <returns></returns>
        private async Task<List<MovieExternal>> GetMoviesFromExt(string searchTerm, int page)
        {
            string urlRequest = $"https://api.themoviedb.org/3/search/movie?api_key=5db2d2b2ae57b67c6d0db0fbebbe22ec&language=en-US&query={searchTerm}&page={page}&include_adult=false";
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

        /// <summary>
        /// Finds a movie item by the external Id
        /// </summary>
        /// <param name="externalId"></param>
        /// <returns></returns>
        public async Task<Movie> FindMovieByExtId(int externalId) =>
            await _context.Movies.SingleOrDefaultAsync(m => m.ExternalId == externalId);

        /// <summary>
        /// Returns whether or not an item has been added to a user
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="itemId"></param>
        /// <returns></returns>
        private bool IsItemInUsersItems(int userId, int? itemId)
        {
            // If there is no itemId, the item is not yet in the DB, no need to check anything
            if (itemId == null)
            {
                return false;
            }

            var userItem = _context.UsersItems.SingleOrDefault(u => u.ItemId == itemId && u.UserId == userId);

            // If we didn't find any result, we return false
            if (userItem == null)
            {
                return false;
            }

            // Item is already in the userItem table for this user
            return true;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using media_tracker.Models;
using Newtonsoft.Json;

namespace media_tracker.Integration.Services
{
    public interface IMovieService
    {
        Task UpdateMovieGenres();
    }

    public class MovieService : IMovieService
    {
        private readonly MediaTrackerContext _context;
        private readonly HttpClient HttpClient;

        public MovieService(MediaTrackerContext _context)
        {
            this._context = _context;
            HttpClient = new HttpClient();
        }

        /// <summary>
        /// Update the list of movie genres in the DB
        /// </summary>
        /// <returns></returns>
        public async Task UpdateMovieGenres()
        {   
            string urlRequest = $" https://api.themoviedb.org/3/genre/movie/list?api_key=5db2d2b2ae57b67c6d0db0fbebbe22ec&language=en-US";
            string jsonResponse = await HttpClient.GetStringAsync(urlRequest);
            var results = JsonConvert.DeserializeObject<MovieGenreResponse>(jsonResponse).Genres;
            // This will update the value of the items if they exist
            foreach (var item in results)
            {
                MovieGenre e = new MovieGenre { Id = item.Id };
                _context.MovieGenres.Attach(e);
                e.Name = item.Name;
            }
            await _context.SaveChangesAsync();
        }
        public class MovieGenreResponse
        {
            public List<MovieGenre> Genres { get; set; }
        }
    }
}

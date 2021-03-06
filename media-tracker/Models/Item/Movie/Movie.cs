﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace media_tracker.Models
{
    /// <summary>
    /// Movie entity. For items with Movies category
    /// </summary>
    public class Movie : MovieExternal
    {
        [Key]
        public int ItemId { get; set; }
        public new int ExternalId { get; set; }
        public new string Description { get; set; }
        public new string ImageUrl { get; set; }
        public new string OriginalLanguage { get; set; }
        public new string ReleaseDate { get; set; }
        public new List<int> Genres { get; set; }


        /// <summary>
        /// Converts from Movie class to MovieView
        /// </summary>
        /// <returns></returns>
        public new async Task<MovieView> ToMovieView()
        {
            using var _context = new MediaTrackerContext();
            var movieView = new MovieView
            {
                ItemId = this.ItemId,
                ExternalId = this.ExternalId,
                Title = this.Title,
                Description = this.Description,
                ImageUrl = this.ImageUrl,
                OriginalLanguage = this.OriginalLanguage,
                ReleaseDate = this.ReleaseDate,
                Genres = await GetMovieGenres(_context),
            };
            return movieView;
        }

        /// <summary>
        /// Gets the movie genres from a list of genre ids
        /// </summary>
        /// <param name="_context"></param>
        /// <returns></returns>
        public new async Task<List<MovieGenre>> GetMovieGenres(MediaTrackerContext _context)
        {
            // If the list of genres is empty, there is no need to query the DB
            if (this.Genres.Count == 0)
            {
                return null;
            }

            return await _context.MovieGenres.Where(g => this.Genres.Contains(g.Id)).ToListAsync();
        }
    }

}

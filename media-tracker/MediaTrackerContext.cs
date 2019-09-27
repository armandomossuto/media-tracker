using System;
using System.Linq;
using System.Reflection;
using media_tracker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace media_tracker
{
    public class MediaTrackerContext : DbContext
    {
        public MediaTrackerContext()
        {
        }

        public MediaTrackerContext(DbContextOptions<MediaTrackerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Item> Items { get; set; }

        public virtual DbSet<UserCategory> UsersCategories { get; set; }

        public virtual DbSet<UserItem> UsersItems { get; set; }

        public virtual DbSet<UserToken> UsersTokens { get; set; }

        public virtual DbSet<MovieGenre> MovieGenres { get; set; }

        public virtual DbSet<Movie> Movies { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Database=mediatracker;Username=me;Password=password");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.HasSequence<int>("users_id_seq");

            modelBuilder.HasSequence<int>("userscategories_id_seq");

            modelBuilder.HasSequence<int>("usersitems_id_seq");

        }
    }
}

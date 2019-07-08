using System;
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

        public virtual DbSet<Users> Users { get; set; }

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

            modelBuilder.Entity<Users>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("nextval('users_id_seq'::regclass)");

                entity.Property(e => e.Email).HasMaxLength(30);

                entity.Property(e => e.Username).HasMaxLength(30);

                entity.Property(e => e.Password).HasMaxLength(30).HasColumnName("password");

            });

            modelBuilder.HasSequence<int>("users_id_seq");
        }
    }
}

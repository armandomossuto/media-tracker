using System;
using System.Threading.Tasks;
using media_tracker.Integration.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace media_tracker.Integration
{

    class Program
    {
        static async Task Main(string[] args)
        {

            //setup our DI
            var provider = ConfigureServices();
            var movieService = provider.GetService<IMovieService>();

            if (args.Length == 0)
            {
                Console.WriteLine("Options: --UpdateMovieGenres - Updates movie Genres");
                return;
            }

            if (args[0] == "--UpdateMovieGenres")
            {
                Console.WriteLine("Updating Movie Genres");
                try
                {
                    await movieService.UpdateMovieGenres();
                    Console.WriteLine("Succesfully completed updating Movie Genres");
                }
                catch (DbUpdateException ex)
                {
                    Console.WriteLine(ex);
                }
                return;
            }
        }

        public static ServiceProvider ConfigureServices()
        {
            var services = new ServiceCollection();
            services.AddDbContext<MediaTrackerContext>(options =>
                options.UseNpgsql("Host=localhost;Port=5432;Username=me;Password=password;Database=mediatracker;"));
            services.AddSingleton<IMovieService, MovieService>();

            return services.BuildServiceProvider();
        }
    }
}

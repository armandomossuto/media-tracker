using System;
using System.Collections.Generic;
using media_tracker.Models;

namespace media_tracker.Tests.MockedData
{
    public class MockedDbData
    {
        public List<User> Users { get; set; }
        public List<Category> Categories { get; set; }
        public List<Item> Items { get; set; }
        public List<UserCategory> UsersCategories { get; set; }
        public List<UserItem> UsersItems { get; set; }
        public List<UserToken> UsersTokens { get; set; }
        public List<MovieGenre> MovieGenres { get; set; }
        public List<Movie> Movies { get; set; }

        /// <summary>
        /// Generates a default mocked data to be used for testing
        /// </summary>
        /// <returns></returns>
        public MockedDbData()
        {
            // A list of 5 users
            var users = new List<User>();
            for (int i = 1; i < 6; i++)
            {
                users.Add(new User
                {
                    Id = i,
                    Username = "user" + i,
                    Email = "email" + i + "@test.com",
                    CreationDate = new DateTime(),
                    ModificationDate = new DateTime(),
                    Password = "asads",
                    Salt = new byte[23],
                });
            }

            // Tokens for the users
            var usersTokens = new List<UserToken>();
            for (int i = 1; i < 6; i++)
            {
                usersTokens.Add(new UserToken
                {
                    UserId = i,
                    RefreshToken = "sdasdsdsad"
                });
            }

            // Generating 3 categories
            var categories = new List<Category>();
            for (int i = 1; i < 4; i++)
            {
                categories.Add(new Category
                {
                    Id = i,
                    Name = "category" + i,
                    Description = "description" + i
                });
            }

            // Adding category with id 1 to all Users
            var usersCategories = new List<UserCategory>();
            for (int i = 1; i < 6; i++)
            {
                usersCategories.Add(new UserCategory
                {
                    Id = i,
                    CategoryId = 1,
                    UserId = i,
                });
            }

            // Generating 2 items to the category id 1
            var items = new List<Item>();
            for (int i = 1; i < 3; i++)
            {
                items.Add(new Item
                {
                    Id = i,
                    CategoryId = 1,
                    Name = "item" + i,
                    Description = "description" + i
                });
            }

            // Generating 2 items to the category id 2
            for (int i = 3; i < 5; i++)
            {
                items.Add(new Item
                {
                    Id = i,
                    CategoryId = 2,
                    Name = "item" + i,
                    Description = "description" + i
                });
            }


            var usersItems = new List<UserItem>();

            // Asigning 3 items to the User Id 1 and 3 to the User Id 2
            for (int i = 1; i < 4; i++)
            {
                usersItems.Add(new UserItem
                {
                    Id = i,
                    ItemId = i,
                    UserId = 1
                });

                usersItems.Add(new UserItem
                {
                    Id = i+3,
                    ItemId = i+1,
                    UserId = 2
                });
            }

            var movieGenres = new List<MovieGenre>()
            {
                new MovieGenre { Id = 28, Name = "Action" },
                new MovieGenre { Id = 12, Name = "Adventure" }
            };

            Users = users;
            UsersTokens = usersTokens;
            Categories = categories;
            UsersCategories = usersCategories;
            Items = items;
            UsersItems = usersItems;
            MovieGenres = movieGenres;
            Movies = new List<Movie> { };
        }
    }
}

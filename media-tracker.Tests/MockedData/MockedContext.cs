using media_tracker.Models;
using Moq;

namespace media_tracker.Tests.MockedData
{
    /// <summary>
    /// For easily storing and having access to both the mocked context and set
    /// </summary>
    public class MockedContext
    {
        public Mock<MediaTrackerContext> Context { get; set; }
        public MockedSet<User> UsersSet { get; set; }
        public MockedSet<UserToken> UsersTokensSet { get; set; }
        public MockedSet<Category> CategoriesSet { get; set; }
        public MockedSet<UserCategory> UsersCategoriesSet { get; set; }
        public MockedSet<Item> ItemsSet { get; set; }
        public MockedSet<UserItem> UsersItemsSet { get; set; }
        public MockedSet<MovieGenre> MovieGenresSet { get; set; }

        public MockedContext(MockedDbData mockedData)
        {
            // Generating mocked DB Sets
            UsersSet = new MockedSet<User>(mockedData.Users);
            UsersTokensSet = new MockedSet<UserToken>(mockedData.UsersTokens);
            CategoriesSet = new MockedSet<Category>(mockedData.Categories);
            UsersCategoriesSet = new MockedSet<UserCategory>(mockedData.UsersCategories);
            ItemsSet = new MockedSet<Item>(mockedData.Items);
            UsersItemsSet = new MockedSet<UserItem>(mockedData.UsersItems);
            MovieGenresSet = new MockedSet<MovieGenre>(mockedData.MovieGenres);

            // Mocking context
            Context = new Mock<MediaTrackerContext>();

            // Mocking each of the entities
            Context.Setup(m => m.Users).Returns(UsersSet.Data.Object);
            Context.Setup(m => m.UsersTokens).Returns(UsersTokensSet.Data.Object);
            Context.Setup(m => m.Categories).Returns(CategoriesSet.Data.Object);
            Context.Setup(m => m.UsersCategories).Returns(UsersCategoriesSet.Data.Object);
            Context.Setup(m => m.Items).Returns(ItemsSet.Data.Object);
            Context.Setup(m => m.UsersItems).Returns(UsersItemsSet.Data.Object);
            Context.Setup(m => m.MovieGenres).Returns(MovieGenresSet.Data.Object);
        }
    }
}

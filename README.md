Media Tracker Platform
======

This is an unfinished project (althought it is 100% functional) for a platform that allows the user to create lists of different types of media (Movies, Comics, etc...).

This was created as a portfolio project and also for self-learning purposes. It is a full stack project.

This has been created using the following stack:


Stack and Architecture
------------
<h3>FE</h3>
<strong>React.js</strong> is used as main framework. For state management, I opted for a custom useState/useReducer/useContext solution that is structured in a similar way as Redux.<br/>

<strong>Typescript</strong> is used for providing static types and improving the maintainence of the project. It is also used for transpilling.<br/>

<strong> Webpack </strong> is used for asset bundling.<br/>

<strong> React Testing library </strong> in combination with <strong> Jest </strong> and <strong> Nock </strong> for testing.<br/>

<h3>BE</h3>
<strong>C#</strong> and <strong>ASPV.net core 3.0</strong> are the fundation of the BE code. We are using <strong>Entity Framework</strong> as ORM and communicating with our <strong> postgreSql </strong> database. This project is <strong>cross-platform</strong>.<br/>

<strong> xunit </strong> is used for testing. We are also using an in-memory database for testing with the help  of <strong>Sqlite</strong>.<br/>


Running the project
------------

<h3>FE</h3>
From the <strong>client</strong> folder inside the project, you can run the following scripts:<br/>
- `npm run start`: starts the webpack server locally for development. By default, you can access it in <strong>https://localhost:8080/</strong>.<br/>
- `npm run build`: generates production assets.<br/>
- `nom run lint`: runs ts/js (eslint) and sass lint.<br/>
- `npm run test` and `npm run test:watch`: for running the FE tests.<br/>

<h3>BE</h3>
The BE is structured in 3 different <strong>solutions</strong> inside the same project.
- <strong>media-tracker</strong>: it is the BE platform. `dotnet run` and `dotnet build`are used for running the platform locally and generating the production assets.<br/>
- <strong>media-tracker.Tests </strong>: contains the tests. `dotnet test` for running them.<br/>
- <strong>media-tracker.Integration</strong>: CLI app for performing some specific tasks that will update some of the DB tables dependant on external APIs. `dotnet run` for having more info about the different options.<br/>

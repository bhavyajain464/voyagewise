# VoyageWise Backend Prototype

A Spring Boot backend application for the VoyageWise travel planning platform.

## Technical Stack

- Java 17
- Spring Boot 3.2.3
- Spring WebFlux
- Spring Data JPA
- Spring Security
- Project Lombok
- MapStruct
- Validation API
- PostgreSQL

## Features

- User registration and authentication
- Trip management
- Itinerary planning
- Activity tracking
- Trip block scheduling

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips` - Get all trips for the current user
- `GET /api/trips/{tripId}` - Get trip by ID

### Itineraries
- `POST /api/itineraries` - Create a new itinerary
- `GET /api/itineraries/trips/{tripId}` - Get itinerary by trip ID

### Trip Blocks
- `POST /api/trip-blocks` - Create a new trip block
- `GET /api/trip-blocks/itineraries/{itineraryId}` - Get all trip blocks for an itinerary

### Activities
- `GET /api/activities` - Get all activities

## Setup

1. Install PostgreSQL and create a database named `voyagewise`
2. Update the database credentials in `application.properties` if needed
3. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

## Configuration

The application is configured to run on port 8080 by default. You can modify the settings in `application.properties`.

## Security

- Basic authentication is implemented
- CORS is configured to allow requests from `http://localhost:3000`
- CSRF is disabled for simplicity in this prototype

## Database Schema

The application uses JPA entities to manage the following tables:
- users
- trips
- itineraries
- trip_blocks
- activities
- users_trips 






FE

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

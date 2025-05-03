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
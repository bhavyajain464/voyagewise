-- Drop existing tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS trip_destinations;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS trip_blocks;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS trips;

-- Recreate trips table
CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recreate itineraries table
CREATE TABLE itineraries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_itinerary (trip_id)
);

-- Recreate trip_destinations table
CREATE TABLE trip_destinations (
    trip_id BIGINT NOT NULL,
    destinations VARCHAR(255) NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
); 
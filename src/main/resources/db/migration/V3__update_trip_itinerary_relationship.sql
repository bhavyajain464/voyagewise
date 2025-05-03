ALTER TABLE itineraries
    ADD CONSTRAINT fk_itinerary_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE CASCADE; 
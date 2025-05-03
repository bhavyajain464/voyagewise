ALTER TABLE activities
    DROP COLUMN name,
    ADD COLUMN title VARCHAR(255) NOT NULL AFTER trip_block_id,
    ADD COLUMN start_time TIMESTAMP NOT NULL AFTER description,
    ADD COLUMN end_time TIMESTAMP NOT NULL AFTER start_time; 
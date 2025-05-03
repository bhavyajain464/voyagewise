CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trip_block_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    FOREIGN KEY (trip_block_id) REFERENCES trip_blocks(id) ON DELETE CASCADE
); 
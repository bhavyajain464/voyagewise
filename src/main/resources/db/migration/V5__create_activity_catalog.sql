CREATE TABLE activity_catalog (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    typical_duration_minutes INT,
    average_cost DECIMAL(10,2),
    tags VARCHAR(255),
    is_popular BOOLEAN DEFAULT FALSE,
    recommended_time TIME
); 
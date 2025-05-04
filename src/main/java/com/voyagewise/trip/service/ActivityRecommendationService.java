package com.voyagewise.trip.service;

import com.voyagewise.trip.model.ActivityCatalog;
import com.voyagewise.trip.repository.ActivityCatalogRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityRecommendationService {
    private final ActivityCatalogRepository activityCatalogRepository;

    public ActivityRecommendationService(ActivityCatalogRepository activityCatalogRepository) {
        this.activityCatalogRepository = activityCatalogRepository;
    }

    public List<ActivityCatalog> ingestActivitiesFromCSV(MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, 
                 CSVFormat.DEFAULT
                     .withFirstRecordAsHeader()
                     .withDelimiter(';')
                     .withIgnoreSurroundingSpaces(true))) {
            
            // Debug: Print header names
            System.out.println("Header names: " + csvParser.getHeaderNames());
            
            List<ActivityCatalog> activities = csvParser.getRecords().stream()
                    .map(record -> {
                        try {
                            // Debug: Print record
                            System.out.println("Processing record: " + record);
                            System.out.println("Record headers: " + record.getParser().getHeaderNames());
                            return mapToActivityCatalog(record);
                        } catch (Exception e) {
                            System.err.println("Error processing record: " + record);
                            System.err.println("Error: " + e.getMessage());
                            throw new RuntimeException("Error processing CSV record: " + e.getMessage(), e);
                        }
                    })
                    .map(activityCatalogRepository::save)
                    .collect(Collectors.toList());
            
            return activities;
        }
    }

    private ActivityCatalog mapToActivityCatalog(CSVRecord record) {
        System.out.println("Processing record: " + record);
        
        ActivityCatalog activity = new ActivityCatalog();
        activity.setTitle(record.get("title"));
        activity.setDescription(record.get("description"));
        activity.setLocation(record.get("location"));
        activity.setCountry(record.get("country"));
        activity.setCategory(record.get("category"));
        
        // Safely parse typical_duration_minutes
        String durationStr = record.get("typical_duration_minutes");
        System.out.println("Duration string: " + durationStr);
        if (durationStr != null && !durationStr.isEmpty()) {
            try {
                activity.setTypicalDurationMinutes(Integer.parseInt(durationStr));
            } catch (NumberFormatException e) {
                System.err.println("Error parsing duration: " + durationStr);
                throw new RuntimeException("Invalid duration format: " + durationStr);
            }
        }
        
        // Safely parse average_cost
        String costStr = record.get("average_cost");
        System.out.println("Cost string: " + costStr);
        if (costStr != null && !costStr.isEmpty()) {
            try {
                activity.setAverageCost(Double.parseDouble(costStr));
            } catch (NumberFormatException e) {
                System.err.println("Error parsing cost: " + costStr);
                throw new RuntimeException("Invalid cost format: " + costStr);
            }
        }
        
        activity.setTags(record.get("tags"));
        activity.setIsPopular(Boolean.parseBoolean(record.get("is_popular")));
        activity.setRecommendedTime(LocalTime.parse(record.get("recommended_time")));
        return activity;
    }

    public List<ActivityCatalog> getRecommendations(String category, String location, String country, Boolean popular) {
        if (category != null) {
            return activityCatalogRepository.findByCategory(category);
        } else if (location != null) {
            return activityCatalogRepository.findByLocation(location);
        } else if (country != null) {
            return activityCatalogRepository.findByCountry(country);
        } else if (popular != null && popular) {
            return activityCatalogRepository.findByIsPopularTrue();
        } else {
            return activityCatalogRepository.findAll();
        }
    }

    public Page<ActivityCatalog> getFilteredActivities(
            String country,
            String location,
            String category,
            List<String> tags,
            Double minCost,
            Double maxCost,
            Integer minDuration,
            Integer maxDuration,
            Boolean isPopular,
            Pageable pageable) {
        
        return activityCatalogRepository.findFilteredActivities(
            country, location, category, minCost, maxCost,
            minDuration, maxDuration, isPopular, pageable);
    }
} 
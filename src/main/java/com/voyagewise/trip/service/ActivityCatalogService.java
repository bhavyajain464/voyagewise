package com.voyagewise.trip.service;

import com.voyagewise.trip.model.ActivityCatalog;
import com.voyagewise.trip.repository.ActivityCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityCatalogService {

    private final ActivityCatalogRepository activityCatalogRepository;

    @Transactional
    public List<ActivityCatalog> ingestActivitiesFromCSV(MultipartFile file) throws IOException {
        List<ActivityCatalog> activities = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        try (CSVParser parser = new CSVParser(
                new InputStreamReader(file.getInputStream()),
                CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            for (CSVRecord record : parser) {
                ActivityCatalog activity = new ActivityCatalog();
                activity.setTitle(record.get("title"));
                activity.setDescription(record.get("description"));
                activity.setLocation(record.get("location"));
                activity.setCountry(record.get("country"));
                activity.setCategory(record.get("category"));
                activity.setTypicalDurationMinutes(Integer.parseInt(record.get("typical_duration_minutes")));
                activity.setAverageCost(Double.parseDouble(record.get("average_cost")));
                activity.setTags(record.get("tags"));
                activity.setIsPopular(Boolean.parseBoolean(record.get("is_popular")));
                activity.setRecommendedTime(LocalTime.parse(record.get("recommended_time"), timeFormatter));

                activities.add(activity);
            }
        }

        return activityCatalogRepository.saveAll(activities);
    }

    public List<ActivityCatalog> getActivitiesByCategory(String category) {
        return activityCatalogRepository.findByCategory(category);
    }

    public List<ActivityCatalog> getActivitiesByLocation(String location) {
        return activityCatalogRepository.findByLocation(location);
    }

    public List<ActivityCatalog> getActivitiesByCountry(String country) {
        return activityCatalogRepository.findByCountry(country);
    }

    public List<ActivityCatalog> getPopularActivities() {
        return activityCatalogRepository.findByIsPopularTrue();
    }
} 
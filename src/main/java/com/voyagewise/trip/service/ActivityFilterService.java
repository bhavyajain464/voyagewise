package com.voyagewise.trip.service;

import com.voyagewise.trip.repository.ActivityCatalogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ActivityFilterService {

    private final ActivityCatalogRepository activityCatalogRepository;

    @Autowired
    public ActivityFilterService(ActivityCatalogRepository activityCatalogRepository) {
        this.activityCatalogRepository = activityCatalogRepository;
    }

    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> filters = new HashMap<>();
        
        // Get distinct values for each filter
        List<String> countries = activityCatalogRepository.findDistinctCountries();
        List<String> locations = activityCatalogRepository.findDistinctLocations();
        List<String> categories = activityCatalogRepository.findDistinctCategories();
        List<String> tags = activityCatalogRepository.findDistinctTags();
        
        // Add to filters map
        filters.put("countries", countries);
        filters.put("locations", locations);
        filters.put("categories", categories);
        filters.put("tags", tags);
        
        return filters;
    }

    public Map<String, Object> getFilterRanges() {
        Map<String, Object> ranges = new HashMap<>();
        
        // Get cost ranges
        Map<String, Double> costRanges = new HashMap<>();
        costRanges.put("min", activityCatalogRepository.findMinCost());
        costRanges.put("max", activityCatalogRepository.findMaxCost());
        
        // Get duration ranges
        Map<String, Integer> durationRanges = new HashMap<>();
        durationRanges.put("min", activityCatalogRepository.findMinDuration());
        durationRanges.put("max", activityCatalogRepository.findMaxDuration());
        
        // Add to ranges map
        ranges.put("cost", costRanges);
        ranges.put("duration", durationRanges);
        
        return ranges;
    }

    public List<String> getCategories() {
        return activityCatalogRepository.findDistinctCategories();
    }

    public Map<String, Double> getCostRanges() {
        Map<String, Double> ranges = new HashMap<>();
        ranges.put("min", activityCatalogRepository.findMinCost());
        ranges.put("max", activityCatalogRepository.findMaxCost());
        return ranges;
    }

    public Map<String, Integer> getDurationRanges() {
        Map<String, Integer> ranges = new HashMap<>();
        ranges.put("min", activityCatalogRepository.findMinDuration());
        ranges.put("max", activityCatalogRepository.findMaxDuration());
        return ranges;
    }
} 
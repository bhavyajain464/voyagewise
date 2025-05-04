package com.voyagewise.trip.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class ActivityCatalogResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String country;
    private String category;
    private Integer typicalDurationMinutes;
    private Double averageCost;
    private String tags;
    private Boolean isPopular;
    private LocalTime recommendedTime;
} 
package com.voyagewise.trip.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripBlockResponse {
    private Long id;
    private Long itineraryId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String country;
    private List<ActivityResponse> activities;
} 
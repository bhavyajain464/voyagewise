package com.voyagewise.trip.dto;

import lombok.Data;

@Data
public class ItineraryResponse {
    private Long id;
    private Long tripId;
    private String title;
    private String description;
} 
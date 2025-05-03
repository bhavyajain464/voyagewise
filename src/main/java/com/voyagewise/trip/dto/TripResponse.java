package com.voyagewise.trip.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TripResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> destinations;
    private boolean hasItinerary;
    private ItineraryResponse itinerary;
} 
package com.voyagewise.trip.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ItineraryRequest {
    @NotNull
    private Long tripId;
    @NotBlank
    private String title;
    private String description;
} 
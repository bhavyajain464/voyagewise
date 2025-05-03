package com.voyagewise.trip.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TripBlockRequest {
    @NotNull
    private Long itineraryId;
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    private String location;
    private String country;
} 
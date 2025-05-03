package com.voyagewise.trip.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class TripRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    private List<String> destinations;
} 
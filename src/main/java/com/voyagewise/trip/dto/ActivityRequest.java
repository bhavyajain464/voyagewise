package com.voyagewise.trip.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String location;
    private String description;
    private String category;
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
    @NotNull
    private Long tripBlockId;
} 
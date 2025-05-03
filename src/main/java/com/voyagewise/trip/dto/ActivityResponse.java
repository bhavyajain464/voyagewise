package com.voyagewise.trip.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityResponse {
    private Long id;
    private String title;
    private String location;
    private String description;
    private String category;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long tripBlockId;
} 
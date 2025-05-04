package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "activity_catalog")
@Data
public class ActivityCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String category;

    @Column(name = "typical_duration_minutes")
    private Integer typicalDurationMinutes;

    @Column(name = "average_cost")
    private Double averageCost;

    private String tags;

    @Column(name = "is_popular")
    private Boolean isPopular;

    @Column(name = "recommended_time")
    private LocalTime recommendedTime;
} 
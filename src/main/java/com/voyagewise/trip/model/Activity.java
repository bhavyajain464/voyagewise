package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_block_id")
    private TripBlock tripBlock;

    @Column
    private String title;  // Name of the activity

    @Column
    private String description;  // Details about the activity

    @Column
    private LocalDateTime startTime;  // When the activity starts

    @Column
    private LocalDateTime endTime;  // When the activity ends

    @Column
    private String location;  // Specific location for the activity

    @Column
    private String category;  // Type of activity (e.g., "Sightseeing", "Food", "Shopping")
} 
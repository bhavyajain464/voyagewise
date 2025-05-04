package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trip_blocks")
@Data
public class TripBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "itinerary_id")
    private Itinerary itinerary;

    @Column
    private String title;  // e.g., "Bangkok", "Phuket", "Chiang Mai"

    @Column
    private String description;  // Description of this segment

    @Column
    private LocalDateTime startTime;  // When this segment starts

    @Column
    private LocalDateTime endTime;  // When this segment ends

    @Column
    private String location;  // Main location/city for this segment

    @Column
    private String country;  // Country for this segment

    @OneToMany(mappedBy = "tripBlock", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("startTime ASC")
    private List<Activity> activities;  // Activities within this segment
} 
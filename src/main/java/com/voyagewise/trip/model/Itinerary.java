package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "itineraries")
@Data
public class Itinerary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "trip_id", unique = true)
    private Trip trip;

    @Column
    private String title;

    @Column
    private String description;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TripBlock> tripBlocks;
} 
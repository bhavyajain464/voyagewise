package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String title;

    @Column
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ElementCollection
    @CollectionTable(name = "trip_destinations", joinColumns = @JoinColumn(name = "trip_id"))
    @Column(name = "destinations")
    private List<String> destinations;

    @OneToOne(mappedBy = "trip", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Itinerary itinerary;
} 
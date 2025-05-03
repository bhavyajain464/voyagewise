package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="users_trips")
@Data
@NoArgsConstructor
public class UserTrip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    private String role; // e.g., "Owner", "Editor", "Viewer"
} 
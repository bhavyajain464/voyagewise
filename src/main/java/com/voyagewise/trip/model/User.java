package com.voyagewise.trip.model;

import javax.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    @Column
    private String password;

    @Column
    private String email;

    @Column
    private String fullName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Trip> trips;
} 
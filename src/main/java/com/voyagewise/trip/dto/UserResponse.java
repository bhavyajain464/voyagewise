package com.voyagewise.trip.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String bio;
    private String token;
} 
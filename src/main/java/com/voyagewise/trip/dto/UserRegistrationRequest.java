package com.voyagewise.trip.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegistrationRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotBlank
    private String email;
    @NotBlank
    private String fullName;
} 
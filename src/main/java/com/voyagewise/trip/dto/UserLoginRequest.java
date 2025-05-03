package com.voyagewise.trip.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
} 
package com.voyagewise.trip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class VoyageWiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(VoyageWiseApplication.class, args);
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from VoyageWise API!";
    }
} 
package com.voyagewise.trip.repository;

import com.voyagewise.trip.model.Trip;
import com.voyagewise.trip.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser(User user);
} 
package com.voyagewise.trip.repository;

import com.voyagewise.trip.model.Activity;
import com.voyagewise.trip.model.TripBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByTripBlock(TripBlock tripBlock);
} 
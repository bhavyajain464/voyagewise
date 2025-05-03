package com.voyagewise.trip.repository;

import com.voyagewise.trip.model.TripBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripBlockRepository extends JpaRepository<TripBlock, Long> {
    List<TripBlock> findByItineraryId(Long itineraryId);
} 
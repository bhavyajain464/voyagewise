package com.voyagewise.trip.repository;

import com.voyagewise.trip.model.ActivityCatalog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ActivityCatalogRepository extends JpaRepository<ActivityCatalog, Long> {
    List<ActivityCatalog> findByCategory(String category);
    List<ActivityCatalog> findByLocation(String location);
    List<ActivityCatalog> findByCountry(String country);
    List<ActivityCatalog> findByIsPopularTrue();

    @Query("SELECT DISTINCT a.country FROM ActivityCatalog a")
    List<String> findDistinctCountries();

    @Query("SELECT DISTINCT a.location FROM ActivityCatalog a")
    List<String> findDistinctLocations();

    @Query("SELECT DISTINCT a.category FROM ActivityCatalog a")
    List<String> findDistinctCategories();

    @Query(value = "SELECT DISTINCT unnest(string_to_array(tags, ',')) FROM activity_catalog", nativeQuery = true)
    List<String> findDistinctTags();

    @Query("SELECT MIN(a.averageCost) FROM ActivityCatalog a")
    Double findMinCost();

    @Query("SELECT MAX(a.averageCost) FROM ActivityCatalog a")
    Double findMaxCost();

    @Query("SELECT MIN(a.typicalDurationMinutes) FROM ActivityCatalog a")
    Integer findMinDuration();

    @Query("SELECT MAX(a.typicalDurationMinutes) FROM ActivityCatalog a")
    Integer findMaxDuration();

    @Query("SELECT a FROM ActivityCatalog a WHERE " +
           "(:country IS NULL OR a.country = :country) AND " +
           "(:location IS NULL OR a.location = :location) AND " +
           "(:category IS NULL OR a.category = :category) AND " +
           "(:minCost IS NULL OR a.averageCost >= :minCost) AND " +
           "(:maxCost IS NULL OR a.averageCost <= :maxCost) AND " +
           "(:minDuration IS NULL OR a.typicalDurationMinutes >= :minDuration) AND " +
           "(:maxDuration IS NULL OR a.typicalDurationMinutes <= :maxDuration) AND " +
           "(:isPopular IS NULL OR a.isPopular = :isPopular)")
    Page<ActivityCatalog> findFilteredActivities(
            @Param("country") String country,
            @Param("location") String location,
            @Param("category") String category,
            @Param("minCost") Double minCost,
            @Param("maxCost") Double maxCost,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            @Param("isPopular") Boolean isPopular,
            Pageable pageable);
} 
package com.voyagewise.trip.controller;

import com.voyagewise.trip.dto.*;
import com.voyagewise.trip.service.UserService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import com.voyagewise.trip.model.ActivityCatalog;
import com.voyagewise.trip.service.ActivityRecommendationService;
import java.util.Map;
import java.util.HashMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import com.voyagewise.trip.service.ActivityFilterService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.voyagewise.trip.service.ProfileService;
import java.security.Principal;
import com.voyagewise.trip.security.CustomUserDetails;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    private final UserService userService;
    private final ActivityRecommendationService activityRecommendationService;
    private final ActivityFilterService activityFilterService;
    private final ProfileService profileService;

    @Autowired
    public UserController(UserService userService, 
                         ActivityRecommendationService activityRecommendationService,
                         ActivityFilterService activityFilterService,
                         ProfileService profileService) {
        this.userService = userService;
        this.activityRecommendationService = activityRecommendationService;
        this.activityFilterService = activityFilterService;
        this.profileService = profileService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        return ResponseEntity.ok(userService.registerUser(registrationRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@Valid @RequestBody UserLoginRequest loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }

    @PostMapping("/activities")
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest activityRequest) {
        return ResponseEntity.ok(userService.createActivity(activityRequest));
    }

    @GetMapping("/activities")
    public ResponseEntity<Page<ActivityCatalog>> getActivities(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) Double minCost,
            @RequestParam(required = false) Double maxCost,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) Boolean isPopular,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        PageRequest pageable = PageRequest.of(page, size, 
            Sort.by(Direction.fromString(sortDirection), sortBy));
        
        Page<ActivityCatalog> activities = activityRecommendationService.getFilteredActivities(
            country, location, category, tags, minCost, maxCost, 
            minDuration, maxDuration, isPopular, pageable);
        
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/activities/categories")
    public ResponseEntity<List<String>> getActivityCategories() {
        return ResponseEntity.ok(activityFilterService.getCategories());
    }

    @GetMapping("/activities/cost-ranges")
    public ResponseEntity<Map<String, Double>> getActivityCostRanges() {
        return ResponseEntity.ok(activityFilterService.getCostRanges());
    }

    @GetMapping("/activities/duration-ranges")
    public ResponseEntity<Map<String, Integer>> getActivityDurationRanges() {
        return ResponseEntity.ok(activityFilterService.getDurationRanges());
    }

    @PostMapping("/trips")
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest tripRequest, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.createTrip(tripRequest, userDetails.getUsername()));
    }

    @GetMapping("/trips")
    public ResponseEntity<List<TripResponse>> getTripsByUser(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("Getting trips for user: " + userDetails.getUsername());
        List<TripResponse> trips = userService.getTripsByUser(userDetails.getUsername());
        System.out.println("Found " + trips.size() + " trips");
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Credentials", "true")
                .body(trips);
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable Long tripId) {
        return ResponseEntity.ok(userService.getTripById(tripId));
    }

    @PostMapping("/itineraries")
    public ResponseEntity<ItineraryResponse> createItinerary(@Valid @RequestBody ItineraryRequest itineraryRequest) {
        return ResponseEntity.ok(userService.createItinerary(itineraryRequest));
    }

    @GetMapping("/trips/{tripId}/itinerary")
    public ResponseEntity<ItineraryResponse> getItineraryByTripId(@PathVariable Long tripId) {
        return ResponseEntity.ok(userService.getItineraryByTripId(tripId));
    }

    @PostMapping("/trip-blocks")
    public ResponseEntity<TripBlockResponse> createTripBlock(@Valid @RequestBody TripBlockRequest tripBlockRequest) {
        return ResponseEntity.ok(userService.createTripBlock(tripBlockRequest));
    }

    @PutMapping("/trip-blocks/{id}")
    public ResponseEntity<TripBlockResponse> updateTripBlock(@PathVariable Long id, @Valid @RequestBody TripBlockRequest tripBlockRequest) {
        return ResponseEntity.ok(userService.updateTripBlock(id, tripBlockRequest));
    }

    @DeleteMapping("/trip-blocks/{id}")
    public ResponseEntity<Void> deleteTripBlock(@PathVariable Long id) {
        userService.deleteTripBlock(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/itineraries/{itineraryId}/trip-blocks")
    public ResponseEntity<List<TripBlockResponse>> getTripBlocksByItineraryId(@PathVariable Long itineraryId) {
        return ResponseEntity.ok(userService.getTripBlocksByItineraryId(itineraryId));
    }

    @GetMapping("/trip-blocks/{id}")
    public ResponseEntity<TripBlockResponse> getTripBlockById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getTripBlockById(id));
    }

    @GetMapping("/trip-blocks/{id}/activities")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByTripBlockId(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getActivitiesByTripBlockId(id));
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityRequest activityRequest) {
        return ResponseEntity.ok(userService.updateActivity(id, activityRequest));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        userService.deleteActivity(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/admin/activities/upload")
    public ResponseEntity<List<ActivityCatalog>> uploadActivities(@RequestParam("file") MultipartFile file) throws IOException {
        List<ActivityCatalog> activities = activityRecommendationService.ingestActivitiesFromCSV(file);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/activities/recommendations")
    public ResponseEntity<List<ActivityCatalog>> getRecommendations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) Boolean popular) {
        List<ActivityCatalog> recommendations = activityRecommendationService.getRecommendations(category, location, country, popular);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/activities/filters")
    public ResponseEntity<Map<String, List<String>>> getActivityFilters() {
        return ResponseEntity.ok(activityFilterService.getFilterOptions());
    }

    @GetMapping("/users/{userId}/profile")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long userId, Principal principal) {
        // Get the current user's ID from the security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            // Verify that the requesting user has access to this profile
            if (!userDetails.getUserId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(profileService.getProfile(userId));
        }
        return ResponseEntity.status(403).build();
    }

    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileUpdateRequest request,
            Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            // Verify that the requesting user has access to this profile
            if (!userDetails.getUserId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(profileService.updateProfile(userId, request));
        }
        return ResponseEntity.status(403).build();
    }

    @PostMapping("/users/{userId}/photos")
    public ResponseEntity<PhotoResponse> uploadPhoto(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            // Verify that the requesting user has access to this profile
            if (!userDetails.getUserId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.ok(profileService.uploadPhoto(userId, file));
        }
        return ResponseEntity.status(403).build();
    }

    @DeleteMapping("/users/{userId}/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long userId,
            @PathVariable Long photoId,
            Principal principal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            // Verify that the requesting user has access to this profile
            if (!userDetails.getUserId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            profileService.deletePhoto(userId, photoId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).build();
    }

    // @GetMapping("/users/me")
    // public ResponseEntity<User> getCurrentUser() {
    //     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    //     String email = authentication.getName();
    //     User user = userService.findByEmail(email);
    //     return ResponseEntity.ok(user);
    // }

} 
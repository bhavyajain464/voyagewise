package com.voyagewise.trip.service;

import com.voyagewise.trip.dto.*;
import com.voyagewise.trip.model.*;
import com.voyagewise.trip.repository.*;
import com.voyagewise.trip.exception.NotFoundException;
import com.voyagewise.trip.security.JwtService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.core.userdetails.UserDetailsService;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final ItineraryRepository itineraryRepository;
    private final TripBlockRepository tripBlockRepository;
    private final ActivityRepository activityRepository;
    private final DtoMapper dtoMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Autowired
    public UserService(UserRepository userRepository, TripRepository tripRepository, ItineraryRepository itineraryRepository, TripBlockRepository tripBlockRepository, ActivityRepository activityRepository, DtoMapper dtoMapper, PasswordEncoder passwordEncoder, JwtService jwtService, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.itineraryRepository = itineraryRepository;
        this.tripBlockRepository = tripBlockRepository;
        this.activityRepository = activityRepository;
        this.dtoMapper = dtoMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public UserResponse registerUser(UserRegistrationRequest registrationRequest) {
        if (userRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        user.setEmail(registrationRequest.getEmail());
        user.setFullName(registrationRequest.getFullName());

        User savedUser = userRepository.save(user);
        return dtoMapper.toUserResponse(savedUser);
    }

    @Transactional
    public UserResponse loginUser(UserLoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        UserResponse response = dtoMapper.toUserResponse(user);
        response.setToken(jwtService.generateToken(userDetailsService.loadUserByUsername(user.getUsername())));
        return response;
    }

    public List<ActivityResponse> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(dtoMapper::toActivityResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TripResponse createTrip(TripRequest tripRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Trip trip = new Trip();
        trip.setTitle(tripRequest.getTitle());
        trip.setDescription(tripRequest.getDescription());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setUser(user);

        Trip savedTrip = tripRepository.save(trip);
        return dtoMapper.toTripResponse(savedTrip);
    }

    public List<TripResponse> getTripsByUser(String username) {
        System.out.println("Finding user: " + username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
        System.out.println("Found user with ID: " + user.getId());

        List<Trip> trips = tripRepository.findByUser(user);
        System.out.println("Found " + trips.size() + " trips for user");

        return trips.stream()
                .map(dtoMapper::toTripResponse)
                .collect(Collectors.toList());
    }

    public TripResponse getTripById(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found"));
        
        // Explicitly fetch the itinerary
        Itinerary itinerary = itineraryRepository.findByTripId(tripId).orElse(null);
        if (itinerary != null) {
            // Fetch trip blocks with activities
            List<TripBlock> tripBlocks = tripBlockRepository.findByItineraryId(itinerary.getId());
            for (TripBlock tripBlock : tripBlocks) {
                // Fetch activities for each trip block
                tripBlock.getActivities().size();
            }
            itinerary.setTripBlocks(tripBlocks);
            trip.setItinerary(itinerary);
        }
        
        return dtoMapper.toTripResponse(trip);
    }

    @Transactional
    public ItineraryResponse createItinerary(ItineraryRequest itineraryRequest) {
        Trip trip = tripRepository.findById(itineraryRequest.getTripId())
                .orElseThrow(() -> new NotFoundException("Trip not found"));

        Itinerary itinerary = new Itinerary();
        itinerary.setTrip(trip);
        itinerary.setTitle(itineraryRequest.getTitle());
        itinerary.setDescription(itineraryRequest.getDescription());

        Itinerary savedItinerary = itineraryRepository.save(itinerary);
        return dtoMapper.toItineraryResponse(savedItinerary);
    }

    public ItineraryResponse getItineraryByTripId(Long tripId) {
        Itinerary itinerary = itineraryRepository.findByTripId(tripId)
                .orElseThrow(() -> new NotFoundException("Itinerary not found"));
        return dtoMapper.toItineraryResponse(itinerary);
    }

    @Transactional
    public TripBlockResponse createTripBlock(TripBlockRequest tripBlockRequest) {
        Itinerary itinerary = itineraryRepository.findById(tripBlockRequest.getItineraryId())
                .orElseThrow(() -> new NotFoundException("Itinerary not found"));

        TripBlock tripBlock = new TripBlock();
        tripBlock.setItinerary(itinerary);
        tripBlock.setTitle(tripBlockRequest.getTitle());
        tripBlock.setDescription(tripBlockRequest.getDescription());
        tripBlock.setStartTime(tripBlockRequest.getStartTime());
        tripBlock.setEndTime(tripBlockRequest.getEndTime());
        tripBlock.setLocation(tripBlockRequest.getLocation());
        tripBlock.setCountry(tripBlockRequest.getCountry());

        TripBlock savedTripBlock = tripBlockRepository.save(tripBlock);
        return dtoMapper.toTripBlockResponse(savedTripBlock);
    }

    public List<TripBlockResponse> getTripBlocksByItineraryId(Long itineraryId) {
        return tripBlockRepository.findByItineraryId(itineraryId).stream()
                .map(tripBlock -> {
                    // Eagerly fetch activities
                    tripBlock.getActivities().size();
                    return dtoMapper.toTripBlockResponse(tripBlock);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ActivityResponse createActivity(ActivityRequest activityRequest) {
        TripBlock tripBlock = tripBlockRepository.findById(activityRequest.getTripBlockId())
                .orElseThrow(() -> new NotFoundException("Trip block not found"));

        Activity activity = new Activity();
        activity.setTitle(activityRequest.getTitle());
        activity.setLocation(activityRequest.getLocation());
        activity.setDescription(activityRequest.getDescription());
        activity.setCategory(activityRequest.getCategory());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setEndTime(activityRequest.getEndTime());
        activity.setTripBlock(tripBlock);

        Activity savedActivity = activityRepository.save(activity);
        return dtoMapper.toActivityResponse(savedActivity);
    }

    public TripBlockResponse getTripBlockById(Long id) {
        TripBlock tripBlock = tripBlockRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Trip block not found"));
        return dtoMapper.toTripBlockResponse(tripBlock);
    }

    public List<ActivityResponse> getActivitiesByTripBlockId(Long tripBlockId) {
        TripBlock tripBlock = tripBlockRepository.findById(tripBlockId)
                .orElseThrow(() -> new NotFoundException("Trip block not found"));
        
        return activityRepository.findByTripBlock(tripBlock).stream()
                .map(dtoMapper::toActivityResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TripBlockResponse updateTripBlock(Long id, TripBlockRequest tripBlockRequest) {
        TripBlock tripBlock = tripBlockRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Trip block not found"));

        Itinerary itinerary = itineraryRepository.findById(tripBlockRequest.getItineraryId())
                .orElseThrow(() -> new NotFoundException("Itinerary not found"));

        tripBlock.setItinerary(itinerary);
        tripBlock.setTitle(tripBlockRequest.getTitle());
        tripBlock.setDescription(tripBlockRequest.getDescription());
        tripBlock.setStartTime(tripBlockRequest.getStartTime());
        tripBlock.setEndTime(tripBlockRequest.getEndTime());
        tripBlock.setLocation(tripBlockRequest.getLocation());
        tripBlock.setCountry(tripBlockRequest.getCountry());

        TripBlock updatedTripBlock = tripBlockRepository.save(tripBlock);
        return dtoMapper.toTripBlockResponse(updatedTripBlock);
    }

    @Transactional
    public void deleteTripBlock(Long id) {
        TripBlock tripBlock = tripBlockRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Trip block not found"));
        tripBlockRepository.delete(tripBlock);
    }

    @Transactional
    public ActivityResponse updateActivity(Long id, ActivityRequest activityRequest) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity not found"));

        TripBlock tripBlock = tripBlockRepository.findById(activityRequest.getTripBlockId())
                .orElseThrow(() -> new NotFoundException("Trip block not found"));

        activity.setTripBlock(tripBlock);
        activity.setTitle(activityRequest.getTitle());
        activity.setLocation(activityRequest.getLocation());
        activity.setDescription(activityRequest.getDescription());
        activity.setCategory(activityRequest.getCategory());
        activity.setStartTime(activityRequest.getStartTime());
        activity.setEndTime(activityRequest.getEndTime());

        Activity updatedActivity = activityRepository.save(activity);
        return dtoMapper.toActivityResponse(updatedActivity);
    }

    @Transactional
    public void deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity not found"));
        activityRepository.delete(activity);
    }
} 
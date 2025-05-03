package com.voyagewise.trip.service;

import com.voyagewise.trip.dto.*;
import com.voyagewise.trip.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DtoMapper {

    UserResponse toUserResponse(User user);

    @Mapping(source = "itinerary", target = "itinerary")
    @Mapping(expression = "java(trip.getItinerary() != null)", target = "hasItinerary")
    TripResponse toTripResponse(Trip trip);

    @Mapping(source = "trip.id", target = "tripId")
    ItineraryResponse toItineraryResponse(Itinerary itinerary);

    @Mapping(source = "itinerary.id", target = "itineraryId")
    @Mapping(source = "activities", target = "activities")
    TripBlockResponse toTripBlockResponse(TripBlock tripBlock);

    ActivityResponse toActivityResponse(Activity activity);
} 
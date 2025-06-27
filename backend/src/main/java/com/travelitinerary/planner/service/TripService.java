package com.travelitinerary.planner.service;

import com.travelitinerary.planner.dto.TripRequest;
import com.travelitinerary.planner.dto.TripResponse;
import com.travelitinerary.planner.dto.DestinationResponse;
import com.travelitinerary.planner.exception.ResourceNotFoundException;
import com.travelitinerary.planner.model.Trip;
import com.travelitinerary.planner.model.User;
import com.travelitinerary.planner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private UserService userService;
    
    public List<TripResponse> getUserTrips(String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        List<Trip> trips = tripRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        return trips.stream()
                .map(this::convertToTripResponse)
                .collect(Collectors.toList());
    }
    
    public TripResponse getTripById(Long tripId, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));
        
        // Check if trip belongs to user
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Trip", "id", tripId);
        }
        
        return convertToTripResponseWithDestinations(trip);
    }
    
    public TripResponse createTrip(TripRequest tripRequest, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        
        Trip trip = new Trip();
        trip.setTitle(tripRequest.getTitle());
        trip.setDescription(tripRequest.getDescription());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setUser(user);
        
        Trip savedTrip = tripRepository.save(trip);
        return convertToTripResponse(savedTrip);
    }
    
    public TripResponse updateTrip(Long tripId, TripRequest tripRequest, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));
        
        // Check if trip belongs to user
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Trip", "id", tripId);
        }
        
        trip.setTitle(tripRequest.getTitle());
        trip.setDescription(tripRequest.getDescription());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        
        Trip updatedTrip = tripRepository.save(trip);
        return convertToTripResponse(updatedTrip);
    }
    
    public void deleteTrip(Long tripId, String userEmail) {
        User user = userService.getUserEntityByEmail(userEmail);
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));
        
        // Check if trip belongs to user
        if (!trip.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Trip", "id", tripId);
        }
        
        tripRepository.delete(trip);
    }
    
    private TripResponse convertToTripResponse(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getDescription(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getDestinationsCount(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }
    
    private TripResponse convertToTripResponseWithDestinations(Trip trip) {
        TripResponse response = convertToTripResponse(trip);
        
        List<DestinationResponse> destinations = trip.getDestinations().stream()
                .map(destination -> new DestinationResponse(
                        destination.getId(),
                        destination.getName(),
                        destination.getDescription(),
                        destination.getDate(),
                        destination.getTime(),
                        destination.getNotes(),
                        destination.getAddress(),
                        destination.getOrderIndex(),
                        destination.getCreatedAt(),
                        destination.getUpdatedAt()
                ))
                .collect(Collectors.toList());
        
        response.setDestinationsList(destinations);
        return response;
    }
} 
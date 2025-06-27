package com.travelitinerary.planner.service;

import com.travelitinerary.planner.dto.DestinationRequest;
import com.travelitinerary.planner.dto.DestinationResponse;
import com.travelitinerary.planner.exception.ResourceNotFoundException;
import com.travelitinerary.planner.model.Destination;
import com.travelitinerary.planner.model.Trip;
import com.travelitinerary.planner.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private TripService tripService;
    
    @Autowired
    private UserService userService;
    
    public DestinationResponse createDestination(Long tripId, DestinationRequest destinationRequest, String userEmail) {
        // Verify trip exists and belongs to user
        tripService.getTripById(tripId, userEmail);
        
        // Get the next order index
        Integer maxOrderIndex = destinationRepository.findMaxOrderIndexByTripId(tripId);
        int nextOrderIndex = (maxOrderIndex != null) ? maxOrderIndex + 1 : 1;
        
        Destination destination = new Destination();
        destination.setName(destinationRequest.getName());
        destination.setDescription(destinationRequest.getDescription());
        destination.setDate(destinationRequest.getDate());
        destination.setTime(destinationRequest.getTime());
        destination.setNotes(destinationRequest.getNotes());
        destination.setAddress(destinationRequest.getAddress());
        destination.setOrderIndex(nextOrderIndex);
        
        // Set the trip
        Trip trip = new Trip();
        trip.setId(tripId);
        destination.setTrip(trip);
        
        Destination savedDestination = destinationRepository.save(destination);
        
        return new DestinationResponse(
                savedDestination.getId(),
                savedDestination.getName(),
                savedDestination.getDescription(),
                savedDestination.getDate(),
                savedDestination.getTime(),
                savedDestination.getNotes(),
                savedDestination.getAddress(),
                savedDestination.getOrderIndex(),
                savedDestination.getCreatedAt(),
                savedDestination.getUpdatedAt()
        );
    }
    
    public DestinationResponse updateDestination(Long destinationId, DestinationRequest destinationRequest, String userEmail) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", destinationId));
        
        // Verify trip belongs to user
        tripService.getTripById(destination.getTrip().getId(), userEmail);
        
        destination.setName(destinationRequest.getName());
        destination.setDescription(destinationRequest.getDescription());
        destination.setDate(destinationRequest.getDate());
        destination.setTime(destinationRequest.getTime());
        destination.setNotes(destinationRequest.getNotes());
        destination.setAddress(destinationRequest.getAddress());
        
        Destination updatedDestination = destinationRepository.save(destination);
        
        return new DestinationResponse(
                updatedDestination.getId(),
                updatedDestination.getName(),
                updatedDestination.getDescription(),
                updatedDestination.getDate(),
                updatedDestination.getTime(),
                updatedDestination.getNotes(),
                updatedDestination.getAddress(),
                updatedDestination.getOrderIndex(),
                updatedDestination.getCreatedAt(),
                updatedDestination.getUpdatedAt()
        );
    }
    
    public void deleteDestination(Long destinationId, String userEmail) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", destinationId));
        
        // Verify trip belongs to user
        tripService.getTripById(destination.getTrip().getId(), userEmail);
        
        destinationRepository.delete(destination);
    }
    
    public List<DestinationResponse> getTripDestinations(Long tripId, String userEmail) {
        // Verify trip exists and belongs to user
        tripService.getTripById(tripId, userEmail);
        
        List<Destination> destinations = destinationRepository.findByTripIdOrderByOrderIndexAsc(tripId);
        
        return destinations.stream()
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
    }
} 
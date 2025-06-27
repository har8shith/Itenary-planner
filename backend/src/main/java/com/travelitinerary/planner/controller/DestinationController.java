package com.travelitinerary.planner.controller;

import com.travelitinerary.planner.dto.DestinationRequest;
import com.travelitinerary.planner.dto.DestinationResponse;
import com.travelitinerary.planner.service.DestinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trips/{tripId}/destinations")
@Tag(name = "Destinations", description = "Destination/Activity management APIs")
@CrossOrigin(origins = "*")
public class DestinationController {
    
    @Autowired
    private DestinationService destinationService;
    
    @GetMapping
    @Operation(summary = "Get trip destinations", description = "Get all destinations for a specific trip")
    public ResponseEntity<List<DestinationResponse>> getTripDestinations(@PathVariable Long tripId, 
                                                                        Authentication authentication) {
        String userEmail = authentication.getName();
        List<DestinationResponse> destinations = destinationService.getTripDestinations(tripId, userEmail);
        return ResponseEntity.ok(destinations);
    }
    
    @PostMapping
    @Operation(summary = "Add destination", description = "Add a new destination to a trip")
    public ResponseEntity<Map<String, Object>> addDestination(@PathVariable Long tripId,
                                                             @Valid @RequestBody DestinationRequest destinationRequest,
                                                             Authentication authentication) {
        String userEmail = authentication.getName();
        DestinationResponse destination = destinationService.createDestination(tripId, destinationRequest, userEmail);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Destination added successfully");
        response.put("destination", destination);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{destinationId}")
    @Operation(summary = "Update destination", description = "Update an existing destination")
    public ResponseEntity<DestinationResponse> updateDestination(@PathVariable Long tripId,
                                                                @PathVariable Long destinationId,
                                                                @Valid @RequestBody DestinationRequest destinationRequest,
                                                                Authentication authentication) {
        String userEmail = authentication.getName();
        DestinationResponse destination = destinationService.updateDestination(destinationId, destinationRequest, userEmail);
        return ResponseEntity.ok(destination);
    }
    
    @DeleteMapping("/{destinationId}")
    @Operation(summary = "Delete destination", description = "Delete a destination from a trip")
    public ResponseEntity<Map<String, String>> deleteDestination(@PathVariable Long tripId,
                                                                @PathVariable Long destinationId,
                                                                Authentication authentication) {
        String userEmail = authentication.getName();
        destinationService.deleteDestination(destinationId, userEmail);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Destination deleted successfully");
        return ResponseEntity.ok(response);
    }
} 
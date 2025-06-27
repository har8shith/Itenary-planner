package com.travelitinerary.planner.controller;

import com.travelitinerary.planner.dto.TripRequest;
import com.travelitinerary.planner.dto.TripResponse;
import com.travelitinerary.planner.service.TripService;
import com.travelitinerary.planner.service.UserService;
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
@RequestMapping("/trips")
@Tag(name = "Trips", description = "Trip management APIs")
@CrossOrigin(origins = "*")
public class TripController {
    
    @Autowired
    private TripService tripService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    @Operation(summary = "Get user trips", description = "Get all trips for the authenticated user")
    public ResponseEntity<Map<String, Object>> getUserTrips(Authentication authentication) {
        String userEmail = authentication.getName();
        List<TripResponse> trips = tripService.getUserTrips(userEmail);
        
        Map<String, Object> response = new HashMap<>();
        response.put("trips", trips);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get trip by ID", description = "Get a specific trip with its destinations")
    public ResponseEntity<Map<String, Object>> getTripById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        TripResponse trip = tripService.getTripById(id, userEmail);
        
        Map<String, Object> response = new HashMap<>();
        response.put("trip", trip);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    @Operation(summary = "Create trip", description = "Create a new trip")
    public ResponseEntity<Map<String, Object>> createTrip(@Valid @RequestBody TripRequest tripRequest, 
                                                         Authentication authentication) {
        String userEmail = authentication.getName();
        TripResponse trip = tripService.createTrip(tripRequest, userEmail);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Trip created successfully");
        response.put("trip", trip);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update trip", description = "Update an existing trip")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long id, 
                                                  @Valid @RequestBody TripRequest tripRequest,
                                                  Authentication authentication) {
        String userEmail = authentication.getName();
        TripResponse trip = tripService.updateTrip(id, tripRequest, userEmail);
        return ResponseEntity.ok(trip);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete trip", description = "Delete a trip")
    public ResponseEntity<Map<String, String>> deleteTrip(@PathVariable Long id, 
                                                         Authentication authentication) {
        String userEmail = authentication.getName();
        tripService.deleteTrip(id, userEmail);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Trip deleted successfully");
        return ResponseEntity.ok(response);
    }
} 
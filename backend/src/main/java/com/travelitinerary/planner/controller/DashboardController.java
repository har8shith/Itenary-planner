package com.travelitinerary.planner.controller;

import com.travelitinerary.planner.dto.DashboardStatsResponse;
import com.travelitinerary.planner.repository.DestinationRepository;
import com.travelitinerary.planner.repository.TripRepository;
import com.travelitinerary.planner.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Dashboard statistics APIs")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/stats")
    @Operation(summary = "Get dashboard stats", description = "Get user dashboard statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String userEmail = authentication.getName();
        Long userId = userService.getUserEntityByEmail(userEmail).getId();
        
        // Get statistics
        long totalTrips = tripRepository.countByUserId(userId);
        long totalDestinations = destinationRepository.countByUserId(userId);
        long upcomingTrips = tripRepository.countUpcomingTripsByUserId(userId, LocalDate.now());
        
        // Mock total expenses (in a real app, you'd have an expenses table)
        double totalExpenses = 2847.5; // Mock value
        
        DashboardStatsResponse stats = new DashboardStatsResponse(
                (int) totalTrips,
                (int) totalDestinations,
                totalExpenses,
                (int) upcomingTrips
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("stats", stats);
        return ResponseEntity.ok(response);
    }
} 
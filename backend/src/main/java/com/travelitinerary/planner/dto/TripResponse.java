package com.travelitinerary.planner.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TripResponse {
    
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private int destinations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DestinationResponse> destinationsList;
    
    // Constructors
    public TripResponse() {}
    
    public TripResponse(Long id, String title, String description, LocalDate startDate, 
                       LocalDate endDate, int destinations, LocalDateTime createdAt, 
                       LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.destinations = destinations;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public int getDestinations() {
        return destinations;
    }
    
    public void setDestinations(int destinations) {
        this.destinations = destinations;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<DestinationResponse> getDestinationsList() {
        return destinationsList;
    }
    
    public void setDestinationsList(List<DestinationResponse> destinationsList) {
        this.destinationsList = destinationsList;
    }
} 
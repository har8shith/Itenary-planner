package com.travelitinerary.planner.dto;

public class DashboardStatsResponse {
    
    private int totalTrips;
    private int totalDestinations;
    private double totalExpenses;
    private int upcomingTrips;
    
    // Constructors
    public DashboardStatsResponse() {}
    
    public DashboardStatsResponse(int totalTrips, int totalDestinations, double totalExpenses, int upcomingTrips) {
        this.totalTrips = totalTrips;
        this.totalDestinations = totalDestinations;
        this.totalExpenses = totalExpenses;
        this.upcomingTrips = upcomingTrips;
    }
    
    // Getters and Setters
    public int getTotalTrips() {
        return totalTrips;
    }
    
    public void setTotalTrips(int totalTrips) {
        this.totalTrips = totalTrips;
    }
    
    public int getTotalDestinations() {
        return totalDestinations;
    }
    
    public void setTotalDestinations(int totalDestinations) {
        this.totalDestinations = totalDestinations;
    }
    
    public double getTotalExpenses() {
        return totalExpenses;
    }
    
    public void setTotalExpenses(double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }
    
    public int getUpcomingTrips() {
        return upcomingTrips;
    }
    
    public void setUpcomingTrips(int upcomingTrips) {
        this.upcomingTrips = upcomingTrips;
    }
} 
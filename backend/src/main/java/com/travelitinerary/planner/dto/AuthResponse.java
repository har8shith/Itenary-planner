package com.travelitinerary.planner.dto;

public class AuthResponse {
    
    private String message;
    private String token;
    private UserDto user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String message, String token, UserDto user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
} 
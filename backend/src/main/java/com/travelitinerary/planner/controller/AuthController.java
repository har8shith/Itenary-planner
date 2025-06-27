package com.travelitinerary.planner.controller;

import com.travelitinerary.planner.dto.AuthResponse;
import com.travelitinerary.planner.dto.LoginRequest;
import com.travelitinerary.planner.dto.SignupRequest;
import com.travelitinerary.planner.dto.UserDto;
import com.travelitinerary.planner.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        UserDto user = userService.getUserByEmail(loginRequest.getEmail());
        
        AuthResponse response = new AuthResponse("Login successful", token, user);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    @Operation(summary = "User registration", description = "Register a new user account")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest signupRequest) {
        UserDto user = userService.createUser(
                signupRequest.getName(),
                signupRequest.getEmail(),
                signupRequest.getPassword()
        );
        
        String token = userService.authenticateUser(signupRequest.getEmail(), signupRequest.getPassword());
        
        AuthResponse response = new AuthResponse("Account created successfully", token, user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get current authenticated user information")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String token) {
        String email = userService.getUserEntityByEmail(token).getEmail();
        UserDto user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
} 
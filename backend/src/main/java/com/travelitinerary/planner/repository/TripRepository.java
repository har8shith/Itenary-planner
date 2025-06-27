package com.travelitinerary.planner.repository;

import com.travelitinerary.planner.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    List<Trip> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT t FROM Trip t WHERE t.user.id = :userId AND t.startDate >= :today ORDER BY t.startDate ASC")
    List<Trip> findUpcomingTripsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);
    
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.user.id = :userId AND t.startDate >= :today")
    long countUpcomingTripsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);
} 
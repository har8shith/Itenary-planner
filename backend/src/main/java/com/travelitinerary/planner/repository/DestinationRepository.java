package com.travelitinerary.planner.repository;

import com.travelitinerary.planner.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    
    List<Destination> findByTripIdOrderByOrderIndexAsc(Long tripId);
    
    @Query("SELECT COUNT(d) FROM Destination d WHERE d.trip.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT MAX(d.orderIndex) FROM Destination d WHERE d.trip.id = :tripId")
    Integer findMaxOrderIndexByTripId(@Param("tripId") Long tripId);
} 
package com.musket.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.musket.dto.RatingRequestDTO;
import com.musket.model.Rating;
import com.musket.model.User;
import com.musket.repository.UserRepository;
import com.musket.service.RatingService;
import com.musket.utils.JwtUtil;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/museums")
@AllArgsConstructor
public class RatingController {
	
    private RatingService ratingService;
    private JwtUtil jwtUtil;
    private UserRepository userRepository;

    // Get all ratings for a museum
    @GetMapping("/{museumId}/ratings")
    public ResponseEntity<List<Rating>> getMuseumRatings(@PathVariable("museumId") Long museumId) {
        List<Rating> ratings = ratingService.getRatingsForMuseum(museumId);
        return ResponseEntity.ok(ratings);
    }

    // Post a rating
    @PostMapping("/{museumId}/rate")
    public ResponseEntity<String> rateMuseum(@PathVariable("museumId") Long museumId,
    										 @RequestHeader("Authorization") String authHeader,
                                             @RequestBody RatingRequestDTO ratingRequest) {
    	System.out.println("rating controller called");
    	// Extract email from JWT token
        String token = authHeader.substring(7);
    	String email = jwtUtil.extractEmail(token);
    	// Fetch user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println(ratingRequest.getRating()+" -rating "+user.getId()+" musuemId "+museumId);
        ratingService.addRating(museumId, user.getId(), ratingRequest.getRating());

        return ResponseEntity.ok("Rating submitted successfully");
    }
}


package com.musket.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.musket.model.Museum;
import com.musket.model.Rating;
import com.musket.model.User;
import com.musket.repository.MuseumRepository;
import com.musket.repository.RatingRepository;
import com.musket.repository.UserRepository;
import com.musket.service.RatingService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RatingServiceImpl implements RatingService {
	
	private RatingRepository ratingRepository;
	private MuseumRepository museumRepository;
	private UserRepository userRepository;

	@Override
	public List<Rating> getRatingsForMuseum(Long museumId) {
		return ratingRepository.findByMuseumId(museumId);
	}

	@Override
	public Rating addRating(Long museumId, Long userId, int ratingValue) {
		Museum museum = museumRepository.findById(museumId)
                .orElseThrow(() -> new RuntimeException("Museum not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Rating rating = new Rating();
        rating.setMuseum(museum);
        rating.setUser(user);
        rating.setRating(ratingValue);

        return ratingRepository.save(rating);
	}

}

package com.musket.service;

import java.util.List;

import com.musket.model.Rating;

public interface RatingService {

	public List<Rating> getRatingsForMuseum(Long museumId);
	public Rating addRating(Long museumId, Long userId, int ratingValue);
}

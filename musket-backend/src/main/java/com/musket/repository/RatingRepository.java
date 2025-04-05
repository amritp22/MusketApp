package com.musket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.musket.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

	List<Rating> findByMuseumId(Long MuseumId);
}

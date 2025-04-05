package com.musket.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.musket.model.Museum;

public interface MuseumRepository extends JpaRepository<Museum, Long> {

}

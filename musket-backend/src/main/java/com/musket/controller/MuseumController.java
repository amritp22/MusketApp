package com.musket.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.musket.dto.MuseumDTO;
import com.musket.model.Museum;
import com.musket.model.TicketForm;
import com.musket.service.MuseumService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/museums")
@AllArgsConstructor
public class MuseumController {

	private MuseumService museumService;
	
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Museum> uploadMuseum(
            @RequestPart("museum") MuseumDTO museumDTO, // JSON data
            @RequestPart("image") MultipartFile image) { // Image file

        try {
            Museum museum = museumService.saveMuseum(museumDTO, image);
            return ResponseEntity.ok(museum);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
	@GetMapping("/getAll")
	public ResponseEntity<List<Museum>> getAllMuseums() {
		List<Museum> museums = museumService.getAllMuseum();
		// changing "imageUrl": "uploads\\raigad fort.jpg"to//"imageUrl": "http://localhost:8080/uploads/raigad fort.jpg"
		//bfeore sending to frontend
		// curently stored as relative path
	    museums.forEach(museum -> {
	        String baseUrl = "http://localhost:8080/";
	        museum.setImageUrl(baseUrl + museum.getImageUrl().replace("\\", "/"));
	    });
	    return ResponseEntity.ok(museums);
      
    }
}

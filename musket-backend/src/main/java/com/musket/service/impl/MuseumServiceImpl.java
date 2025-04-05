package com.musket.service.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.musket.dto.MuseumDTO;
import com.musket.model.Museum;
import com.musket.repository.MuseumRepository;
import com.musket.service.FileStorageService;
import com.musket.service.MuseumService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MuseumServiceImpl implements MuseumService  {

	private MuseumRepository museumRepository;
	private final FileStorageService fileStorageService;

	@Override
	public Museum saveMuseum(MuseumDTO museumDto, MultipartFile image) throws IOException {
		String imageUrl = fileStorageService.uploadFile(image);
		Museum museum = new Museum();
        museum.setName(museumDto.getName());
        museum.setTimings(museumDto.getTimings());
        museum.setDescription(museumDto.getDescription());
        museum.setImageUrl(imageUrl);
        
        return museumRepository.save(museum);
	}

	@Override
	public List<Museum> getAllMuseum() {
		return museumRepository.findAll();
	}


}

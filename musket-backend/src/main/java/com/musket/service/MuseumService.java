package com.musket.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.musket.dto.MuseumDTO;
import com.musket.model.Museum;
import com.musket.model.TicketForm;

public interface MuseumService {

	public Museum saveMuseum(MuseumDTO museumDto,MultipartFile image) throws IOException;
	public List<Museum> getAllMuseum();
}

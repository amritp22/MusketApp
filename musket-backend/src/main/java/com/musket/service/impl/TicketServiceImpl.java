package com.musket.service.impl;

import java.io.IOException;
import java.util.List;


import org.springframework.stereotype.Service;

import com.google.zxing.WriterException;
import com.musket.model.TicketForm;
import com.musket.model.User;
import com.musket.repository.TicketRepository;
import com.musket.repository.UserRepository;
import com.musket.service.TicketService;
import com.musket.utils.QRCodeGenerator;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService {


    private TicketRepository ticketRepository;
    private UserRepository userRepository;
    
	@Override
	public TicketForm saveTicket(TicketForm ticketForm,String userEmail) throws WriterException, IOException {
		// Fetch user from DB using email
	    User user = userRepository.findByEmail(userEmail)
	            .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

		
		// Associate user with ticket
	    ticketForm.setUser(user);
	    
	 // Convert ticket details to JSON for QR code
		String ticketData = "Name: " + ticketForm.getFullName() +
							"\nMuseum: " + ticketForm.getMuseum() +
							"\nPersons: " + ticketForm.getNoPerson() +
							"\nDate: " + ticketForm.getDate() +
							"\nTime: " + ticketForm.getTime();
		// Generate QR code as Base64
        String qrCodeBase64 = QRCodeGenerator.generateQRCodeBase64(ticketData);
        ticketForm.setQrCode(qrCodeBase64);
		return ticketRepository.save(ticketForm);
		
	}

	@Override
	public void save(TicketForm ticket) {
	    ticketRepository.save(ticket);
	}
	@Override
	public List<TicketForm> getTickets() {
		return ticketRepository.findAll();
	}

	@Override
	public TicketForm getTicketById(Long id) {
		return ticketRepository.findById(id).get();
	}

	@Override
	public TicketForm findByQrCodeData(String qrCode) {
		return ticketRepository.findByQrCode(qrCode);
	}

	@Override
	public TicketForm findByFullNameAndMuseum(String fullName, String museum) {
		return ticketRepository.findByFullNameAndMuseum(fullName, museum);
	}

	@Override
	public List<TicketForm> getTicketsByUser(String email) {
		// TODO Auto-generated method stub
		return ticketRepository.findByUserEmail(email);
	}

}

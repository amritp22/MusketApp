package com.musket.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.zxing.WriterException;
import com.musket.model.TicketForm;

public interface TicketService {

	public TicketForm saveTicket(TicketForm ticketForm,String userEmail) throws WriterException, IOException;
	public List<TicketForm> getTickets();
	public TicketForm getTicketById(Long id);
	public TicketForm findByQrCodeData(String qrCode);
	public TicketForm findByFullNameAndMuseum(String fullName, String museum);
	public void save(TicketForm ticket);//save data without generating new qr used to update status to used
	public List<TicketForm> getTicketsByUser(String email);
}

package com.musket.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.musket.dto.TicketResponseDTO;
import com.musket.model.TicketForm;
import com.musket.model.TicketStatus;
import com.musket.service.TicketService;
import com.musket.utils.JwtUtil;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {

	private TicketService ticketService;
	private JwtUtil jwtUtil;
//	@PostMapping("/create")
//	public ResponseEntity<TicketResponseDTO> createTicket(@RequestBody TicketForm ticketForm){
//		try {
//			TicketForm savedTicketForm=ticketService.saveTicket(ticketForm);
//			//sending ticket id that generated and qrcode to frontend
//			return ResponseEntity.ok(new TicketResponseDTO(savedTicketForm.getId(), savedTicketForm.getQrCode()));
//		} catch (Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//		}
//	}
	@PostMapping("/create")
	public ResponseEntity<TicketResponseDTO> createTicket(
	        @RequestBody TicketForm ticketForm, 
	        @RequestHeader("Authorization") String authHeader) {
		
		System.out.println("Received request: " + ticketForm);
	    System.out.println("Authorization Header: " + authHeader);
	    try {
	        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	        }

	        // Extract email from JWT token
	        String token = authHeader.substring(7);
	        System.out.println("Received etractinin eami: " + token);
	        String userEmail = jwtUtil.extractEmail(token);
	        System.out.println("Received user eami: " + userEmail);

	        // Save ticket with user association
	        TicketForm savedTicketForm = ticketService.saveTicket(ticketForm, userEmail);
	        
	        return ResponseEntity.ok(new TicketResponseDTO(savedTicketForm.getId(), savedTicketForm.getQrCode()));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}

	
	@GetMapping("/find")
	public ResponseEntity<List<TicketForm>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getTickets());
    }
	// ✅ Fetch tickets for the currently logged-in user
	@GetMapping("/my-tickets")
	public List<TicketForm> getMyTickets(@RequestHeader("Authorization") String token){
		String email=jwtUtil.extractEmail(token.replace("Bearer ", ""));
		return ticketService.getTicketsByUser(email);
	}
	
	@GetMapping("/find/{id}")
	public ResponseEntity<TicketForm> createTicket(@PathVariable("id") long id){
		TicketForm getTicketForm=ticketService.getTicketById(id);
		return ResponseEntity.ok(getTicketForm);
	}
	@GetMapping("find/{id}/qr")
	public ResponseEntity<byte[]> getTicketQRCode(@PathVariable("id") long id) throws WriterException, IOException {
	    TicketForm ticket = ticketService.getTicketById(id);

	    String ticketData = "ID:" + ticket.getNoPerson() + "|Name:" + ticket.getFullName() + "|Date:" + ticket.getDate() + 
	    		"|Name:" + ticket.getMuseum();
	    ByteArrayOutputStream stream = new ByteArrayOutputStream();
	    
	    BitMatrix bitMatrix = new QRCodeWriter().encode(ticketData, BarcodeFormat.QR_CODE, 300, 300);
	    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", stream);

	    return ResponseEntity.ok()
	            .contentType(MediaType.IMAGE_PNG)
	            .body(stream.toByteArray());
	}
	@PostMapping("/verify")
	public ResponseEntity<Map<String, String>> verifyTicket(@RequestBody Map<String, String> requestBody) {
	    String qrCode = requestBody.get("qrCode");
	    System.out.println("Received QR Code: " + qrCode);

	    Map<String, String> response = new HashMap<>();
	    
//	    TicketForm ticket = ticketService.findByQrCodeData(qrCode);
	    Map<String, String> extractedData = extractQrData(qrCode);
	    String fullName = extractedData.get("name");
	    String museum = extractedData.get("museum");
	    System.out.println("Received full : " + extractedData+" "+fullName+" "+museum);
	    
	    TicketForm ticket = ticketService.findByFullNameAndMuseum(fullName, museum);
	    if (ticket == null) {
	        response.put("status", "error");
	        response.put("message", "Ticket not found");
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	    }

	    if (ticket.getStatus() == TicketStatus.USED) {
	        response.put("status", "error");
	        response.put("message", "Ticket already used");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	    }

	    ticket.setStatus(TicketStatus.USED);
	    ticketService.save(ticket);

	    response.put("status", "success");
	    response.put("message", "Ticket is valid. Access granted!");
	    return ResponseEntity.ok(response);
	}
	private Map<String, String> extractQrData(String qrCode) {
	    Map<String, String> data = new HashMap<>();
	    try {
	        // Split QR Code data by new line
	        String[] lines = qrCode.split("\n");

	        for (String line : lines) {
	            String[] keyValue = line.split(": ", 2); // Split only at the first ": "
	            if (keyValue.length == 2) {
	                String key = keyValue[0].trim().toLowerCase(); // Convert key to lowercase
	                String value = keyValue[1].trim();
	                data.put(key, value); // Store key-value pair
	            }
	        }
	    } catch (Exception e) {
	        System.out.println("Error parsing QR code: " + e.getMessage());
	    }
	    return data;
	}

	
}

package com.musket.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TicketResponseDTO {

	private Long ticketId;
    private String qrCode; // Base64 QR Code
}

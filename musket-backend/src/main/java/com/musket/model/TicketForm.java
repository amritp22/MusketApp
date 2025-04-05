package com.musket.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "ticket_form")
@Data
public class TicketForm {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
    private String fullName;
//    private String userId;
    private String museum;
    private String contact;
    private LocalDate date;
    private int noPerson;
    private String time;
    @Lob  // Store large text (Base64)
    private String qrCode;
    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.VALID;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}


package com.musket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.musket.model.TicketForm;
@Repository
public interface TicketRepository extends JpaRepository<TicketForm, Long> {
	@Query("SELECT t FROM TicketForm t WHERE t.qrCode = :qrCode")
	TicketForm findByQrCode(@Param("qrCode") String qrCode);
	TicketForm findByFullNameAndMuseum(String fullName, String museum);
	
	List<TicketForm> findByUserEmail(String email);
}

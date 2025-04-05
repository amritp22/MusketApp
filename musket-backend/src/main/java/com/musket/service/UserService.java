package com.musket.service;

import org.springframework.http.ResponseEntity;

import com.musket.model.User;

public interface UserService {

	public void registerUser(User user);
	public ResponseEntity<Void> verifyEmail(String token);
	public void sendVerificationEmail(User user);
	public void sendAdminInvite(String email);
	public void verifyAdminInvite(String token);
}

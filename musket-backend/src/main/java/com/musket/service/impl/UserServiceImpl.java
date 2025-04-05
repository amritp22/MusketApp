package com.musket.service.impl;

import java.net.URI;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.musket.model.Role;
import com.musket.model.User;
import com.musket.repository.UserRepository;
import com.musket.service.UserService;
import com.musket.utils.JwtUtil;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private UserRepository userRepository;
	private JavaMailSender javaMailSender;
	private JwtUtil jwtUtil;
	
	@Override
	public void registerUser(User user) {
		user.setVerified(false);
		user.setRole(Role.USER); // Default role
		user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
		
		
		// Generate a UUID token and save it
	    String token = UUID.randomUUID().toString();
	    user.setVerificationToken(token);

	    userRepository.save(user);
	    
		//send verification email
		sendVerificationEmail(user);
		
	}

	
	@Override
	public ResponseEntity<Void> verifyEmail(String token) {
		User foundUser = userRepository.findByVerificationToken(token);

	    if (foundUser == null) {
	    	return ResponseEntity.badRequest().build();
	    }

	    // Mark user as verified
	    foundUser.setVerified(true);
	    foundUser.setVerificationToken(null); // Clear token after verification
	    userRepository.save(foundUser);
	    
	    return ResponseEntity.status(HttpStatus.FOUND) 
	            .location(URI.create("http://localhost:3000/login")) // Redirect to login page
	            .build();
	}



	@Override
	public void sendVerificationEmail(User user) {
		// Use the token already saved in the user object
	    String verificationLink = "http://localhost:8080/api/auth/verify?token=" + user.getVerificationToken();

		
		SimpleMailMessage message=new SimpleMailMessage();
		message.setTo(user.getEmail());
		message.setSubject("Email Verification for musket");
		message.setText("verfiy your account for successful login "+verificationLink);
		javaMailSender.send(message);
		
	}

	@Override
	public void sendAdminInvite(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!user.isVerified()) {
            throw new RuntimeException("User must verify email first.");
        }

        String token = jwtUtil.generateToken(email);
        String inviteLink = "http://localhost:8080/api/auth/verify-admin?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Admin Invitation for Musket");
        message.setText("Click the link to become an admin: " + inviteLink);
        javaMailSender.send(message);
		
	}

	@Override
	public void verifyAdminInvite(String token) {
		String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
        		.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!user.isVerified()) {
            throw new RuntimeException("User must verify email first.");
        }

        user.setRole(Role.ADMIN);
        userRepository.save(user);
		
	}

}

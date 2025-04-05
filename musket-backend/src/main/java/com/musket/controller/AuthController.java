package com.musket.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.musket.model.User;
import com.musket.repository.UserRepository;
import com.musket.service.UserService;
import com.musket.utils.JwtUtil;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

	private UserService userService;
	private UserRepository userRepository;
	private JwtUtil jwtUtil;
	private AuthenticationManager authenticationManager;
	private UserDetailsService userDetailsService;
	private PasswordEncoder passwordEncoder;

	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody User user){
		userService.registerUser(user);
		return ResponseEntity.ok("User registered successfully. Please check your email for verification.");
	}
	// ✅ VERIFY EMAIL
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully! You can now log in.");
    }
    
    //login user
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        try {
            // Fetch user from database
            User dbUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Check password
            if (!passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
                throw new BadCredentialsException("Invalid password");
            }

            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            // Return JSON response with token
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("email", dbUser.getEmail()); // Send user email
            response.put("fullName", dbUser.getFullName()); // Send user name if needed
            response.put("role", "ROLE_"+dbUser.getRole()); // Send user name if needed

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Login failed: " + e.getMessage()));
        }
    }

 // ✅ SEND ADMIN INVITE
    @PostMapping("/invite-admin")
    public ResponseEntity<String> inviteAdmin(@RequestParam String email) {
        userService.sendAdminInvite(email);
        return ResponseEntity.ok("Admin invite sent successfully.");
    }

    // ✅ VERIFY ADMIN INVITE
    @GetMapping("/verify-admin")
    public ResponseEntity<String> verifyAdmin(@RequestParam("token") String token) {
        userService.verifyAdminInvite(token);
        return ResponseEntity.ok("User upgraded to ADMIN successfully!");
    }
}

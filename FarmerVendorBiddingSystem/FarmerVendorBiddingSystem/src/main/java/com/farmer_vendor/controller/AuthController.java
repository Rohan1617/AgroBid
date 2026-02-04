package com.farmer_vendor.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.farmer_vendor.entity.PasswordResetToken;
import com.farmer_vendor.entity.User;
import com.farmer_vendor.repo.PasswordResetTokenRepository;
import com.farmer_vendor.repo.UserRepository;
import com.farmer_vendor.security.JwtUtil;
import com.farmer_vendor.service.EmailService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {

        User user = new User();
        user.setName(req.get("name"));
        user.setEmail(req.get("email"));
        user.setMobile(req.get("mobile"));

        // 🔥 ROLE FIX (VERY IMPORTANT)
        String role = req.get("role");
        if (role == null || role.isBlank()) {
            throw new RuntimeException("Role is required");
        }
        user.setRole(role.toUpperCase()); // FARMER / VENDOR

        // 🔐 PASSWORD ENCODE
        user.setPassword(passwordEncoder.encode(req.get("password")));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "email", user.getEmail(),
                "role", user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "User not found"));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(
                    Map.of("message", "Invalid email or password"));
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", token,
                "userId", user.getUserId(),
                "email", user.getEmail(),
                "role", user.getRole()));
    }

    // ✅ FORGOT PASSWORD
    // ✅ FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> req) {
        try {
            String email = req.get("email");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // remove old token if exists
            try {
                tokenRepository.deleteByUser(user);
            } catch (Exception e) {
                System.err.println("⚠️ Could not delete old token: " + e.getMessage());
            }

            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));

            PasswordResetToken savedToken = tokenRepository.save(resetToken);
            System.out.println("💾 TOKEN SAVED TO DB: " + savedToken.getToken());

            String resetLink = "http://localhost:3000/reset-password?token=" + token;

            // Log it because actual email service might fail or not be configured
            System.out.println("🔗 RESET LINK: " + resetLink);
            try {
                emailService.sendResetEmail(user.getEmail(), resetLink);
            } catch (Exception e) {
                System.err.println("⚠️ EMAIL SENDING FAILED: " + e.getMessage());
                // Proceed anyway so user can use the console link
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Password reset email sent"));
        } catch (Exception e) {
            e.printStackTrace(); // Print full stack trace to console
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {
        System.out.println("🔄 RESET PASSWORD INVOKED. Payload: " + req);
        try {
            String token = req.get("token");
            String newPassword = req.get("newPassword");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest()
                        .body(java.util.Collections.singletonMap("error", "Token and new password are required"));
            }

            PasswordResetToken resetToken = tokenRepository.findByToken(token)
                    .orElseThrow(() -> {
                        System.err.println("❌ Token NOT found in DB: " + token);
                        return new RuntimeException("Invalid reset token: '" + token
                                + "' not found. (Did you generate a new link? Old links are invalidated.)");
                    });

            System.out.println("✅ Token found: " + resetToken.getToken());
            System.out.println("⏳ Expiry Date: " + resetToken.getExpiryDate());
            System.out.println("⌚ Current Time: " + LocalDateTime.now());

            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                System.err.println("❌ Token Expired!");
                throw new RuntimeException("Reset token expired");
            }

            User user = resetToken.getUser();
            if (user == null) {
                throw new RuntimeException("Associated user not found");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            tokenRepository.delete(resetToken);

            System.out.println("✅ Password successfully reset for: " + user.getEmail());
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Password reset successful"));
        } catch (Exception e) {
            e.printStackTrace();
            String msg = (e.getMessage() != null) ? e.getMessage() : e.getClass().getName();
            return ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", msg));
        }
    }

    @GetMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        try {
            System.out.println("🔍 VERIFY REQUEST for token: " + token);
            PasswordResetToken resetToken = tokenRepository.findByToken(token)
                    .orElse(null);

            if (resetToken == null) {
                return ResponseEntity.status(404)
                        .body("❌ Token NOT FOUND in database. Make sure you generated a new one.");
            }

            if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(400).body("❌ Token EXPIRED. Expiry: " + resetToken.getExpiryDate());
            }

            return ResponseEntity.ok("✅ Token is VALID for user: " + resetToken.getUser().getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug/tokens")
    public ResponseEntity<?> getAllTokens() {
        try {
            java.util.List<Map<String, String>> tokens = new java.util.ArrayList<>();
            tokenRepository.findAll().forEach(t -> {
                Map<String, String> m = new java.util.HashMap<>();
                m.put("token", t.getToken());
                m.put("expiry", t.getExpiryDate().toString());
                m.put("user_email", t.getUser().getEmail());
                tokens.add(m);
            });
            return ResponseEntity.ok(tokens);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}

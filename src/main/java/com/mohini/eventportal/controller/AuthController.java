package com.mohini.eventportal.controller;

import com.mohini.eventportal.dto.JwtResponse;
import com.mohini.eventportal.dto.LoginRequest;
import com.mohini.eventportal.dto.SignupRequest;
import com.mohini.eventportal.model.User;
import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.UserRepository;
import com.mohini.eventportal.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        String userId = null;
        String username = userDetails.getUsername();
        String email = null;
        String fullName = null;
        String phone = null;
        String district = null;
        String collegeId = null;
        String collegeName = null;

        if (roles.contains("ROLE_COORDINATOR")) {
            com.mohini.eventportal.model.College college = collegeRepository.findByUsername(username).get();
            userId = college.getCollegeCode();
            email = college.getEmail();
            fullName = college.getCoordinatorName();
            phone = college.getPhone();
            district = college.getDistrict();
            collegeId = college.getCollegeCode();
            collegeName = college.getCollegeName();
        } else {
            User user = userRepository.findByUsername(username).get();
            userId = String.valueOf(user.getId());
            email = user.getEmail();
            fullName = user.getFullName();
            phone = user.getPhone();
            district = user.getDistrict();
            if (user.getCollegeId() != null) {
                collegeId = user.getCollegeId();
                com.mohini.eventportal.model.College c = collegeRepository.findById(collegeId).orElse(null);
                if (c != null) {
                    collegeName = c.getCollegeName();
                }
            }
        }

        return ResponseEntity.ok(new JwtResponse(jwt,
                userId,
                username,
                email,
                roles,
                fullName,
                phone,
                district,
                collegeId,
                collegeName));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .fullName(signUpRequest.getFullName())
                .phone(signUpRequest.getPhone())
                .district(signUpRequest.getDistrict())
                .build();

        String strRole = signUpRequest.getRole();
        if (strRole == null) {
            user.setRole(User.Role.STUDENT);
        } else {
            switch (strRole.toUpperCase()) {
                case "ADMIN":
                    user.setRole(User.Role.ADMIN);
                    break;
                default:
                    user.setRole(User.Role.STUDENT);
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}

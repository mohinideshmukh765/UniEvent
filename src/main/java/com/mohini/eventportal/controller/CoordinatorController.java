package com.mohini.eventportal.controller;

import com.mohini.eventportal.dto.DashboardStats;
import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.model.User;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.PostRepository;
import com.mohini.eventportal.repository.RegistrationRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    PostRepository postRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getDashboardStats() {
        User user = getCurrentUser();
        if (user == null || user.getCollege() == null) {
            return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(0, 0, 0, 0));
        }

        Long collegeId = user.getCollege().getId();
        long totalEvents = eventRepository.countByCollegeId(collegeId);
        long presentEvents = eventRepository.countByCollegeIdAndStatus(collegeId, com.mohini.eventportal.model.Event.EventStatus.PUBLISHED);
        long pastEvents = eventRepository.countByCollegeIdAndStatus(collegeId, com.mohini.eventportal.model.Event.EventStatus.COMPLETED);
        long totalRegistrations = registrationRepository.countByEventCollegeId(collegeId);

        return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(totalEvents, presentEvents, pastEvents, totalRegistrations));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getEvents() {
        User user = getCurrentUser();
        if (user == null || user.getCollege() == null) return ResponseEntity.ok(java.util.Collections.emptyList());
        return ResponseEntity.ok(eventRepository.findByCollegeId(user.getCollege().getId()));
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getRegistrations() {
        User user = getCurrentUser();
        if (user == null || user.getCollege() == null) return ResponseEntity.ok(java.util.Collections.emptyList());
        return ResponseEntity.ok(registrationRepository.findByEventCollegeId(user.getCollege().getId()));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getPosts() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createEvent(@RequestBody Event eventData) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        Event event = Event.builder()
                .title(eventData.getTitle())
                .description(eventData.getDescription())
                .category(eventData.getCategory())
                .eventDate(eventData.getEventDate())
                .venue(eventData.getVenue())
                .maxParticipants(eventData.getMaxParticipants())
                .registrationDeadline(eventData.getRegistrationDeadline())
                .coordinator(user)
                .college(user.getCollege())
                .status(Event.EventStatus.PUBLISHED)
                .build();

        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/posts")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createPost(
            @RequestParam("caption") String caption,
            @RequestParam(value = "images", required = false) java.util.List<org.springframework.web.multipart.MultipartFile> images) {

        User user = getCurrentUser();
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        String imagePaths = "";
        if (images != null && !images.isEmpty()) {
            java.util.List<String> paths = new java.util.ArrayList<>();
            java.io.File uploadDir = new java.io.File("uploads/posts");
            uploadDir.mkdirs();
            for (org.springframework.web.multipart.MultipartFile file : images) {
                if (!file.isEmpty()) {
                    try {
                        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        java.io.File dest = new java.io.File(uploadDir, filename);
                        file.transferTo(dest);
                        paths.add("/uploads/posts/" + filename);
                    } catch (Exception ex) {
                        // skip failed upload
                    }
                }
            }
            imagePaths = String.join(",", paths);
        }

        com.mohini.eventportal.model.Post post = com.mohini.eventportal.model.Post.builder()
                .caption(caption)
                .images(imagePaths.isEmpty() ? null : imagePaths)
                .coordinator(user)
                .build();

        com.mohini.eventportal.model.Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateProfile(@RequestBody User profileData) {
        User user = getCurrentUser();
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }

        // Update fields allowed for modification
        if (profileData.getFullName() != null) user.setFullName(profileData.getFullName());
        if (profileData.getPhone() != null) user.setPhone(profileData.getPhone());
        if (profileData.getDistrict() != null) user.setDistrict(profileData.getDistrict());
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username).orElse(null);
    }
}

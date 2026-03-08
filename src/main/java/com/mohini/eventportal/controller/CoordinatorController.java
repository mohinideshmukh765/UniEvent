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
        if (user == null) {
            return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(0, 0, 0, 0));
        }

        Long coordinatorId = user.getId();
        long totalEvents = eventRepository.countByCoordinatorId(coordinatorId);
        long presentEvents = eventRepository.countByCoordinatorIdAndStatus(coordinatorId, com.mohini.eventportal.model.Event.EventStatus.PUBLISHED);
        long pastEvents = eventRepository.countByCoordinatorIdAndStatus(coordinatorId, com.mohini.eventportal.model.Event.EventStatus.COMPLETED);
        
        // Let's also check if college is null for registrations, if null then 0 for now as registrations are tied to an event's college.
        // It would be better to fetch registrations for the coordinator's events, but for simplicity we keep college logic or 0.
        long totalRegistrations = 0;
        if (user.getCollege() != null) {
            totalRegistrations = registrationRepository.countByEventCollegeId(user.getCollege().getId());
        }

        return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(totalEvents, presentEvents, pastEvents, totalRegistrations));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getEvents() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.ok(java.util.Collections.emptyList());
        
        // Fetch by coordinator ID so they always see events they created
        return ResponseEntity.ok(eventRepository.findByCoordinatorId(user.getId()));
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

    @PutMapping("/events/{eventId}/dates")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateEventDates(@PathVariable("eventId") Long eventId, @RequestBody java.util.Map<String, String> dates) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (!optionalEvent.isPresent()) {
            return ResponseEntity.badRequest().body("Event not found");
        }

        Event event = optionalEvent.get();
        // Verify ownership
        if (event.getCoordinator() == null || !event.getCoordinator().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Unauthorized to edit this event");
        }

        try {
            String eventDateStr = dates.get("eventDate");
            String deadlineStr = dates.get("registrationDeadline");

            if (eventDateStr != null && !eventDateStr.isEmpty()) {
                event.setEventDate(java.time.LocalDateTime.parse(eventDateStr));
            }
            if (deadlineStr != null && !deadlineStr.isEmpty()) {
                event.setRegistrationDeadline(java.time.LocalDateTime.parse(deadlineStr));
            }
        } catch (java.time.format.DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected ISO-8601 (e.g. YYYY-MM-DDTHH:mm:ss). Passed: " + e.getParsedString());
        }

        Event saved = eventRepository.save(event);
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
        if (profileData.getUsername() != null && !profileData.getUsername().trim().isEmpty() && !profileData.getUsername().equals(user.getUsername())) {
             if (userRepository.existsByUsername(profileData.getUsername())) {
                  return ResponseEntity.badRequest().body("Error: Username is already taken!");
             }
             user.setUsername(profileData.getUsername());
        }

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

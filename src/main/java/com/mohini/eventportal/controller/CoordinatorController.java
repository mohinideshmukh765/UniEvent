package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.repository.PostRepository;
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
    com.mohini.eventportal.repository.UserRepository userRepository;

    @Autowired
    com.mohini.eventportal.repository.CollegeRepository collegeRepository;

    @Autowired
    com.mohini.eventportal.repository.EventRepository eventRepository;

    @Autowired
    com.mohini.eventportal.repository.RegistrationRepository registrationRepository;

    @Autowired
    PostRepository postRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getDashboardStats() {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) {
            return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(0, 0, 0, 0));
        }

        String collegeCode = college.getCollegeCode();
        long totalEvents = eventRepository.countByCollegeCollegeCode(collegeCode);
        long presentEvents = eventRepository.countByCollegeCollegeCodeAndStatus(collegeCode, com.mohini.eventportal.model.Event.EventStatus.PUBLISHED);
        long pastEvents = eventRepository.countByCollegeCollegeCodeAndStatus(collegeCode, com.mohini.eventportal.model.Event.EventStatus.COMPLETED);
        long totalRegistrations = registrationRepository.countByEventCollegeCollegeCode(collegeCode);

        return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(totalEvents, presentEvents, pastEvents, totalRegistrations));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getEvents() {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) return ResponseEntity.ok(java.util.Collections.emptyList());
        return ResponseEntity.ok(eventRepository.findByCollegeCollegeCode(college.getCollegeCode()));
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getRegistrations() {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) return ResponseEntity.ok(java.util.Collections.emptyList());
        return ResponseEntity.ok(registrationRepository.findByEventCollegeCollegeCode(college.getCollegeCode()));
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getPosts() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createEvent(@RequestBody Event eventData) {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) return ResponseEntity.badRequest().body("Coordinator profile not found");

        Event event = Event.builder()
                .title(eventData.getTitle())
                .description(eventData.getDescription())
                .category(eventData.getCategory())
                .eventDate(eventData.getEventDate())
                .venue(eventData.getVenue())
                .maxParticipants(eventData.getMaxParticipants())
                .registrationDeadline(eventData.getRegistrationDeadline())
                .college(college)
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

        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) return ResponseEntity.badRequest().body("Coordinator profile not found");

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
                .college(college)
                .build();

        com.mohini.eventportal.model.Post saved = postRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/events/{eventId}/dates")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateEventDates(@PathVariable("eventId") Long eventId, @RequestBody java.util.Map<String, String> dates) {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) return ResponseEntity.badRequest().body("Coordinator profile not found");

        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (!optionalEvent.isPresent()) {
            return ResponseEntity.badRequest().body("Event not found");
        }

        Event event = optionalEvent.get();
        // Verify college ownership
        if (event.getCollege() == null || !event.getCollege().getCollegeCode().equals(college.getCollegeCode())) {
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
    public ResponseEntity<?> updateProfile(@RequestBody com.mohini.eventportal.model.College profileData) {
        com.mohini.eventportal.model.College college = getCurrentCollege();
        if (college == null) {
            return ResponseEntity.badRequest().body("Error: Coordinator profile not found!");
        }

        if (profileData.getCoordinatorName() != null) college.setCoordinatorName(profileData.getCoordinatorName());
        if (profileData.getPhone() != null) college.setPhone(profileData.getPhone());
        if (profileData.getCity() != null) college.setCity(profileData.getCity());
        if (profileData.getDistrict() != null) college.setDistrict(profileData.getDistrict());

        collegeRepository.save(college);
        return ResponseEntity.ok(college);
    }

    private com.mohini.eventportal.model.College getCurrentCollege() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return collegeRepository.findByUsername(username).orElse(null);
    }
}

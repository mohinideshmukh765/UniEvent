package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.User;
import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.RegistrationRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    com.mohini.eventportal.repository.PostRepository postRepository;

    @Autowired
    com.mohini.eventportal.repository.ActivityLogRepository activityLogRepository;

    @Autowired
    com.mohini.eventportal.service.ExcelService excelService;

    @Autowired
    com.mohini.eventportal.service.EmailService emailService;

    @Autowired
    org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/colleges/upload")
    public ResponseEntity<?> uploadColleges(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            java.util.List<com.mohini.eventportal.service.ExcelService.CollegeOnboardingData> dataList = excelService.parseOnboardingExcel(file);
            int count = 0;
            int skipped = 0;
            int emailFailures = 0;
            StringBuilder log = new StringBuilder();

            for (com.mohini.eventportal.service.ExcelService.CollegeOnboardingData data : dataList) {
                String username = data.getCollegeCode().toLowerCase();
                String email = data.getEmail();
                String rawPassword = "CO-" + data.getCollegeCode();

                // Use existing college if it exists, otherwise prepare to create new
                com.mohini.eventportal.model.College college = collegeRepository.findByCollegeCode(data.getCollegeCode()).orElse(null);

                // If both college and its coordinator (username) exist, skip
                if (college == null) {
                    // Check if username or email already exists for another COLLEGE
                    if (collegeRepository.existsByUsername(username) || collegeRepository.existsByEmail(email)) {
                        skipped++;
                        log.append("College Username/Email already exists: ").append(username).append(" / ").append(email).append("\n");
                        continue;
                    }
                } else {
                    // College exists, check if it already has coordinator credentials
                    if (college.getUsername() != null && !college.getUsername().isEmpty()) {
                        skipped++;
                        continue;
                    }
                }

                // ATOMIC OPERATION: Try sending email BEFORE saving to DB
                try {
                    emailService.sendCoordinatorCredentials(email, data.getCoordinatorName(), username, rawPassword);
                } catch (Exception e) {
                    emailFailures++;
                    log.append("Email failed for ").append(email).append(": ").append(e.getMessage()).append("\n");
                    continue; // Skip if email fails
                }

                // If email succeeded, try saving to DB
                try {
                    if (college == null) {
                        college = com.mohini.eventportal.model.College.builder()
                                .collegeCode(data.getCollegeCode())
                                .collegeName(data.getCollegeName())
                                .coordinatorName(data.getCoordinatorName())
                                .email(email)
                                .phone(data.getPhone())
                                .username(username)
                                .password(passwordEncoder.encode(rawPassword))
                                .city(data.getCity())
                                .district(data.getDistrict())
                                .enabled(true)
                                .build();
                    } else {
                        // Update existing college with coordinator credentials
                        college.setCoordinatorName(data.getCoordinatorName());
                        college.setEmail(email);
                        college.setPhone(data.getPhone());
                        college.setUsername(username);
                        college.setPassword(passwordEncoder.encode(rawPassword));
                        college.setEnabled(true);
                    }
                    collegeRepository.save(college);
                    count++;
                } catch (Exception e) {
                    skipped++;
                    log.append("DB Save failed for row ").append(username).append(": ").append(e.getMessage()).append("\n");
                }
            }

            String result = String.format("Onboarding Complete: %d added successfully, %d skipped, %d email failures (not added).", 
                                         count, skipped, emailFailures);
            if (emailFailures > 0 || skipped > 0) {
                result += "\n\nDetails:\n" + log.toString();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing file [" + file.getOriginalFilename() + "]: " + e.getMessage());
        }
    }

    @PostMapping("/colleges/deactivate/{collegeCode}")
    public ResponseEntity<?> deactivateCollege(@PathVariable("collegeCode") String collegeCode) {
        try {
            return collegeRepository.findById(collegeCode).map(college -> {
                college.setEnabled(false);
                collegeRepository.save(college);
                return ResponseEntity.ok("College " + college.getCollegeName() + " has been deactivated.");
            }).orElse(ResponseEntity.badRequest().body("College not found in database with code: '" + collegeCode + "'"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("DB Error: " + e.getMessage() + (e.getCause() != null ? " | Cause: " + e.getCause().getMessage() : ""));
        }
    }

    @PostMapping("/colleges/activate/{collegeCode}")
    public ResponseEntity<?> activateCollege(@PathVariable("collegeCode") String collegeCode) {
        try {
            return collegeRepository.findById(collegeCode).map(college -> {
                college.setEnabled(true);
                collegeRepository.save(college);
                return ResponseEntity.ok("College " + college.getCollegeName() + " has been activated.");
            }).orElse(ResponseEntity.badRequest().body("College not found in database with code: '" + collegeCode + "'"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("DB Error: " + e.getMessage() + (e.getCause() != null ? " | Cause: " + e.getCause().getMessage() : ""));
        }
    }

    @GetMapping("/colleges/registered")
    public ResponseEntity<?> getRegisteredColleges() {
        java.util.List<com.mohini.eventportal.model.College> colleges = collegeRepository.findAll();
        
        System.out.println("DEBUG: Found " + colleges.size() + " colleges in DB.");
        
        return ResponseEntity.ok(colleges.stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", c.getCollegeCode()); // use collegeCode as id
                    map.put("name", c.getCollegeName()); // frontend uses .name
                    map.put("collegeName", c.getCollegeName()); // keep for backward compatibility
                    map.put("collegeCode", c.getCollegeCode());
                    map.put("district", c.getDistrict());
                    map.put("city", c.getCity());
                    map.put("status", Boolean.TRUE.equals(c.getEnabled()) ? "activated" : "disabled");
                    map.put("coordinatorName", c.getCoordinatorName() != null ? c.getCoordinatorName() : "Not Onboarded");
                    map.put("email", c.getEmail() != null ? c.getEmail() : "N/A");
                    map.put("phone", c.getPhone() != null ? c.getPhone() : "N/A");
                    map.put("username", c.getUsername());
                    return map;
                })
                .collect(Collectors.toList()));
    }

    @GetMapping("/debug/all-users")
    public ResponseEntity<?> getAllUsersDebug() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", u.getUsername());
                    map.put("email", u.getEmail());
                    map.put("role", u.getRole() != null ? u.getRole().toString() : "null");
                    return map;
                })
                .collect(Collectors.toList()));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalColleges", collegeRepository.countDistinctCollegeCode());
        stats.put("totalStudents", userRepository.countByRole(User.Role.STUDENT));
        stats.put("upcomingEvents", eventRepository.countByEventDateAfter(now));
        stats.put("pastEvents", eventRepository.countByEventDateBefore(now));
        stats.put("totalRegistrations", registrationRepository.count());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/events/upcoming-active")
    public ResponseEntity<?> getUpcomingActiveEvents() {
        return ResponseEntity.ok(eventRepository.findUpcomingEvents(java.time.LocalDateTime.now()));
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities() {
        return ResponseEntity.ok(activityLogRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/colleges")
    public ResponseEntity<?> getAllColleges() {
        return ResponseEntity.ok(collegeRepository.findAll());
    }

    @PostMapping("/colleges/{collegeCode}/status")
    public ResponseEntity<?> updateCollegeStatus(@PathVariable("collegeCode") String collegeCode, @RequestParam("status") String status) {
        return collegeRepository.findById(collegeCode).map(college -> {
            college.setEnabled(status.equalsIgnoreCase("activated") || status.equalsIgnoreCase("approved"));
            collegeRepository.save(college);
            return ResponseEntity.ok("Status updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable("id") Long id, @RequestParam("status") com.mohini.eventportal.model.Event.EventStatus status) {
        return eventRepository.findById(id.intValue()).map(event -> {
            event.setStatus(status);
            eventRepository.save(event);
            return ResponseEntity.ok("Event status updated");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/events/{eventId}/post")
    public ResponseEntity<?> getEventPost(@PathVariable("eventId") Integer eventId) {
        return eventRepository.findById(eventId)
                .flatMap(event -> postRepository.findByEvent(event))
                .map(post -> ResponseEntity.ok(post))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(postRepository.findAllByOrderByCreatedAtDesc().stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("caption", post.getCaption());
            map.put("photo", post.getPhoto());
            map.put("createdAt", post.getCreatedAt());
            map.put("feedbackFormLink", post.getFeedbackFormLink());
            
            if (post.getEvent() != null) {
                Map<String, Object> eventMap = new HashMap<>();
                eventMap.put("id", post.getEvent().getId());
                eventMap.put("title", post.getEvent().getTitle());
                if (post.getEvent().getCollege() != null) {
                    Map<String, Object> collegeMap = new HashMap<>();
                    collegeMap.put("collegeName", post.getEvent().getCollege().getCollegeName());
                    collegeMap.put("collegeCode", post.getEvent().getCollege().getCollegeCode());
                    eventMap.put("college", collegeMap);
                }
                map.put("event", eventMap);
            }
            return map;
        }).collect(Collectors.toList()));
    }

    @DeleteMapping("/posts/{eventId}")
    public ResponseEntity<?> deletePost(@PathVariable("eventId") Integer eventId) {
        if (postRepository.existsById(eventId)) {
            postRepository.deleteById(eventId);
            return ResponseEntity.ok("Post deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/registrations")
    public ResponseEntity<?> getAllRegistrations() {
        java.util.List<Map<String, Object>> result = registrationRepository.findAll().stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", r.getUsername());
                    map.put("status", r.getStatus());
                    map.put("registrationDate", r.getRegistrationDate() != null ? r.getRegistrationDate().toString() : null);
                    map.put("groupId", r.getGroupId());
                    try {
                        com.mohini.eventportal.model.Event ev = r.getEvent();
                        if (ev != null) {
                            Map<String, Object> evMap = new HashMap<>();
                            evMap.put("id", ev.getId());
                            evMap.put("title", ev.getTitle());
                            evMap.put("category", ev.getCategory());
                            if (ev.getCollege() != null) {
                                Map<String, Object> colMap = new HashMap<>();
                                colMap.put("name", ev.getCollege().getCollegeName());
                                colMap.put("district", ev.getCollege().getDistrict());
                                colMap.put("city", ev.getCollege().getCity());
                                evMap.put("college", colMap);
                            }
                            map.put("event", evMap);
                        }
                    } catch (Exception ignored) { }
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/registrations/today")
    public ResponseEntity<?> getTodayRegistrations() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.util.List<Map<String, Object>> result = registrationRepository.findAll().stream()
                .filter(r -> r.getRegistrationDate() != null &&
                             r.getRegistrationDate().toLocalDate().equals(today))
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", r.getUsername());
                    map.put("status", r.getStatus());
                    map.put("registrationDate", r.getRegistrationDate() != null ? r.getRegistrationDate().toString() : null);
                    // Safely access lazy-loaded event
                    try {
                        com.mohini.eventportal.model.Event ev = r.getEvent();
                        if (ev != null) {
                            Map<String, Object> evMap = new HashMap<>();
                            evMap.put("id", ev.getId());
                            evMap.put("title", ev.getTitle());
                            if (ev.getCollege() != null) {
                                Map<String, Object> colMap = new HashMap<>();
                                colMap.put("name", ev.getCollege().getCollegeName());
                                colMap.put("district", ev.getCollege().getDistrict());
                                evMap.put("college", colMap);
                            }
                            map.put("event", evMap);
                        }
                    } catch (Exception ignored) { }
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}


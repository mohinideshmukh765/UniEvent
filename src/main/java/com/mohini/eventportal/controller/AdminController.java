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

                // Skip if college already exists
                if (collegeRepository.existsByCollegeCode(data.getCollegeCode())) {
                    skipped++;
                    continue;
                }

                // Check if username or email already exists for another user
                if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
                    skipped++;
                    log.append("User/Email already exists for skipped row: ").append(username).append(" / ").append(email).append("\n");
                    continue;
                }

                // Create College
                com.mohini.eventportal.model.College college = com.mohini.eventportal.model.College.builder()
                        .collegeCode(data.getCollegeCode())
                        .name(data.getCollegeName())
                        .city(data.getCity())
                        .district(data.getDistrict())
                        .status(com.mohini.eventportal.model.College.CollegeStatus.APPROVED)
                        .address("Bulk Uploaded")
                        .build();
                college = collegeRepository.save(college);

                // Create Coordinator User
                User coordinator = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(rawPassword))
                        .fullName(data.getCoordinatorName())
                        .phone(data.getPhone())
                        .role(User.Role.COORDINATOR)
                        .college(college)
                        .enabled(true)
                        .build();
                userRepository.save(coordinator);

                // Send Email
                try {
                    emailService.sendCoordinatorCredentials(email, data.getCoordinatorName(), username, rawPassword);
                } catch (Exception e) {
                    emailFailures++;
                    log.append("Email failed for ").append(email).append(": ").append(e.getMessage()).append("\n");
                    System.err.println("Email failed for " + email + ": " + e.getMessage());
                }

                count++;
            }

            String result = String.format("Onboarding Complete: %d added, %d skipped (duplicates), %d email failures.", 
                                         count, skipped, emailFailures);
            if (emailFailures > 0) {
                result += "\n\nErrors:\n" + log.toString();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing file [" + file.getOriginalFilename() + "]: " + e.getMessage());
        }
    }

    @GetMapping("/colleges/registered")
    public ResponseEntity<?> getRegisteredColleges() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.COORDINATOR)
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("collegeName", u.getCollege().getName());
                    map.put("collegeCode", u.getCollege().getCollegeCode());
                    map.put("coordinatorName", u.getFullName());
                    map.put("email", u.getEmail());
                    map.put("phone", u.getPhone());
                    map.put("district", u.getCollege().getDistrict());
                    map.put("city", u.getCollege().getCity());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList()));
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
        return ResponseEntity.ok(eventRepository.findByStatusAndEventDateAfter(
            com.mohini.eventportal.model.Event.EventStatus.PUBLISHED, 
            java.time.LocalDateTime.now()
        ));
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities() {
        return ResponseEntity.ok(activityLogRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/colleges")
    public ResponseEntity<?> getAllColleges() {
        return ResponseEntity.ok(collegeRepository.findAll());
    }

    @PostMapping("/colleges/{id}/status")
    public ResponseEntity<?> updateCollegeStatus(@PathVariable Long id, @RequestParam com.mohini.eventportal.model.College.CollegeStatus status) {
        return collegeRepository.findById(id).map(college -> {
            college.setStatus(status);
            collegeRepository.save(college);
            return ResponseEntity.ok("Status updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestParam com.mohini.eventportal.model.Event.EventStatus status) {
        return eventRepository.findById(id).map(event -> {
            event.setStatus(status);
            eventRepository.save(event);
            return ResponseEntity.ok("Event status updated");
        }).orElse(ResponseEntity.notFound().build());
    }
}

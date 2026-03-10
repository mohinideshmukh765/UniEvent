package com.mohini.eventportal.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.model.Registration;
import com.mohini.eventportal.model.User;
import com.mohini.eventportal.model.Notification;
import com.mohini.eventportal.repository.UserRepository;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.RegistrationRepository;
import com.mohini.eventportal.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    /**
     * POST /api/student/register
     * Expects Multipart form data:
     * - eventId: Integer
     * - transactionId: String (optional)
     * - teamMembers: JSON array of strings (usernames)
     * - qrcode: File (optional, screenshot)
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerForEvent(
            @RequestParam("eventId") Integer eventId,
            @RequestParam(value = "transactionId", required = false) String transactionId,
            @RequestParam("teamMembers") String teamMembersJson,
            @RequestParam(value = "qrcode", required = false) MultipartFile qrcodeFile) {

        // Get current student (team leader)
        String leaderUsername = getCurrentUsername();
        if (leaderUsername == null)
            return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> leaderOpt = userRepository.findByUsername(leaderUsername);
        if (!leaderOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "Student not found"));
        User leader = leaderOpt.get();

        // Find event
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "Event not found"));
        Event event = eventOpt.get();

        // Check deadline
        if (event.getRegistrationDeadline() != null
                && event.getRegistrationDeadline().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration deadline has passed"));
        }

        // Parse team members
        List<String> teamUsernames;
        try {
            teamUsernames = objectMapper.readValue(teamMembersJson, new TypeReference<List<String>>() {
            });
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid teamMembers format"));
        }

        if (teamUsernames == null || teamUsernames.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "At least one participant (the leader) is required"));
        }

        // Validate team size
        int count = teamUsernames.size();
        if (count < event.getMinParticipants()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Minimum " + event.getMinParticipants() + " participants required"));
        }
        if (count > event.getMaxParticipants()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Maximum " + event.getMaxParticipants() + " participants allowed"));
        }

        // Validate all usernames exist and are students
        List<String> invalidUsernames = new ArrayList<>();
        for (String uname : teamUsernames) {
            Optional<User> uOpt = userRepository.findByUsername(uname.trim());
            if (!uOpt.isPresent()) {
                invalidUsernames.add(uname + " (Not registered)");
            } else if (uOpt.get().getRole() != User.Role.STUDENT) {
                invalidUsernames.add(uname + " (Not a student)");
            }
        }
        if (!invalidUsernames.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Registration blocked. Issues with: " + String.join(", ", invalidUsernames)));
        }

        // Check if any member already registered for this event
        for (String uname : teamUsernames) {
            if (registrationRepository.existsByUsernameAndEvent_Id(uname.trim(), eventId)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "User '" + uname + "' is already registered for this event"));
            }
        }

        // Validate payment for paid events
        String screenshotUrl = null;
        if (event.getFeePerPerson() > 0) {
            if (transactionId == null || transactionId.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Transaction ID is required for paid events"));
            }
            if (qrcodeFile == null || qrcodeFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Payment screenshot (QR Code) is required for paid events"));
            }
        }

        // Numeric increment logic for Group ID — compute before saving screenshot
        Integer maxGroupId = registrationRepository.findMaxGroupId();
        String nextGroupId = String.valueOf(maxGroupId + 1);

        // Save payment screenshot to disk: uploads/payment_success/{groupId}/
        if (qrcodeFile != null && !qrcodeFile.isEmpty()) {
            try {
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(getUploadBase(), "payment_success",
                        nextGroupId);
                java.nio.file.Files.createDirectories(uploadPath);

                String ext = getExtension(qrcodeFile.getOriginalFilename());
                String filename = "payment_" + System.currentTimeMillis() + "." + ext;
                java.nio.file.Path dest = uploadPath.resolve(filename);

                java.nio.file.Files.copy(qrcodeFile.getInputStream(), dest,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                screenshotUrl = "/uploads/payment_success/" + nextGroupId + "/" + filename;
            } catch (IOException e) {
                return ResponseEntity.status(500)
                        .body(Map.of("message", "Error saving payment screenshot: " + e.getMessage()));
            }
        }

        List<Registration> registrationsToSave = new ArrayList<>();
        for (String uname : teamUsernames) {
            Registration reg = Registration.builder()
                    .event(event)
                    .username(uname.trim())
                    .transactionId(transactionId)
                    .groupId(nextGroupId)
                    .paymentScreenshotPath(screenshotUrl) // file URL on disk
                    .status("PENDING")
                    .registrationDate(java.time.LocalDateTime.now())
                    .build();
            registrationsToSave.add(reg);
        }

        registrationRepository.saveAll(registrationsToSave);

        // Fire notification to coordinator's college
        String collegeCode = event.getCollege() != null ? event.getCollege().getCollegeCode() : "0";
        String notifTitle = "New Registration Pending Approval";
        String notifMsg = String.format(
                "Student '%s' submitted registration for '%s'. Team size: %d. Group ID: %s. UPI/Ref: %s",
                leader.getFullName(),
                event.getTitle(),
                count,
                nextGroupId,
                transactionId != null ? transactionId : "N/A");

        Notification notification = Notification.builder()
                .title(notifTitle)
                .message(notifMsg)
                .targetAudience("COLLEGE:" + collegeCode)
                .build();
        notificationRepository.save(notification);

        // Fire notification to each student in the team
        String studentMsg = String.format(
                "You have registered for '%s' scheduled on %s. Status is currently PENDING approval.",
                event.getTitle(), event.getEventDate() != null ? event.getEventDate().toLocalDate().toString() : "TBD");

        for (String uname : teamUsernames) {
            userRepository.findByUsername(uname.trim()).ifPresent(u -> {
                Notification n = Notification.builder()
                        .title("Registration Submitted")
                        .message(studentMsg)
                        .recipient(u)
                        .targetAudience("USER:" + u.getUsername())
                        .build();
                notificationRepository.save(n);
            });
        }

        return ResponseEntity.ok(Map.of(
                "groupId", nextGroupId,
                "status", "PENDING",
                "message", "Registration successful! Group ID: " + nextGroupId));
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyRegistrations() {
        String username = getCurrentUsername();
        if (username == null)
            return ResponseEntity.status(401).body("Unauthorized");

        List<Registration> regs = registrationRepository.findByUsername(username);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Registration r : regs) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", r.getGroupId());
            dto.put("groupId", r.getGroupId());
            dto.put("status", r.getStatus());
            dto.put("reason", r.getReason());
            dto.put("registrationDate", r.getRegistrationDate());
            if (r.getEvent() != null) {
                dto.put("eventTitle", r.getEvent().getTitle());
                dto.put("eventDate", r.getEvent().getEventDate());
                dto.put("eventDescription", r.getEvent().getDescription());
                dto.put("eventVenue", r.getEvent().getVenue());
                dto.put("coordinatorName", r.getEvent().getCoordinatorName());
                dto.put("coordinatorMobile", r.getEvent().getCoordinatorMobile());
                dto.put("organizedBy", r.getEvent().getOrganizedBy());
                dto.put("feePerPerson", r.getEvent().getFeePerPerson());
                dto.put("category", r.getEvent().getCategory());
                if (r.getEvent().getCollege() != null) {
                    dto.put("collegeName", r.getEvent().getCollege().getCollegeName());
                    dto.put("district", r.getEvent().getCollege().getDistrict());
                }
            }
            dto.put("transactionId", r.getTransactionId());
            if (r.getPaymentScreenshotPath() != null) {
                dto.put("paymentScreenshot", r.getPaymentScreenshotPath());
            }

            // Fetch all members of this group
            List<Registration> groupMembers = registrationRepository.findByGroupId(r.getGroupId());
            List<Map<String, String>> membersList = new ArrayList<>();
            for (Registration m : groupMembers) {
                Map<String, String> memberInfo = new HashMap<>();
                memberInfo.put("username", m.getUsername());
                userRepository.findByUsername(m.getUsername()).ifPresent(u -> {
                    memberInfo.put("fullName", u.getFullName());
                    memberInfo.put("email", u.getEmail());
                    memberInfo.put("phone", u.getPhone());
                    memberInfo.put("college", u.getCollege());
                });
                membersList.add(memberInfo);
            }
            dto.put("members", membersList);
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyNotifications() {
        String username = getCurrentUsername();
        if (username == null)
            return ResponseEntity.status(401).body("Unauthorized");

        // Using the finder from NotificationRepository
        List<Notification> notifs = notificationRepository
                .findByTargetAudienceContainingOrderBySentAtDesc("USER:" + username);
        return ResponseEntity.ok(notifs);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getProfile() {
        String username = getCurrentUsername();
        if (username == null)
            return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> uOpt = userRepository.findByUsername(username);
        if (!uOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        User user = uOpt.get();

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("fullName", user.getFullName());
        profile.put("phone", user.getPhone());
        profile.put("district", user.getDistrict());
        profile.put("college", user.getCollege());
        profile.put("collegeId", user.getCollegeId());

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        String username = getCurrentUsername();
        if (username == null)
            return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> uOpt = userRepository.findByUsername(username);
        if (!uOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        User user = uOpt.get();

        if (payload.containsKey("fullName"))
            user.setFullName(payload.get("fullName"));
        if (payload.containsKey("phone"))
            user.setPhone(payload.get("phone"));
        if (payload.containsKey("district"))
            user.setDistrict(payload.get("district"));
        if (payload.containsKey("college"))
            user.setCollege(payload.get("college"));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
        String username = getCurrentUsername();
        if (username == null)
            return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> uOpt = userRepository.findByUsername(username);
        if (!uOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        User user = uOpt.get();

        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password cannot be empty"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails)
            return ((UserDetails) principal).getUsername();
        return principal.toString();
    }

    /**
     * Returns the absolute base path for uploads, ensuring it's relative to the
     * project root
     */
    private String getUploadBase() {
        String userDir = System.getProperty("user.dir");
        java.io.File uploads = new java.io.File(userDir, "uploads");
        if (!uploads.exists()) {
            uploads.mkdirs();
        }
        return uploads.getAbsolutePath();
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains("."))
            return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}

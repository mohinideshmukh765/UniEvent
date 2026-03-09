package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.*;
import com.mohini.eventportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    /**
     * POST /api/student/register
     * Body: {
     *   eventId: Long,
     *   upiId: String (optional, for paid events),
     *   teamMembers: [ { username, name, email, college, branch, year } ]
     * }
     */
    @PostMapping("/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Object> body) {
        // Get current student (team leader)
        String leaderUsername = getCurrentUsername();
        if (leaderUsername == null) return ResponseEntity.status(401).body("Unauthorized");

        Optional<User> leaderOpt = userRepository.findByUsername(leaderUsername);
        if (!leaderOpt.isPresent()) return ResponseEntity.badRequest().body("Student not found");
        User leader = leaderOpt.get();

        // Parse eventId
        Long eventId;
        try {
            eventId = Long.valueOf(body.get("eventId").toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid eventId");
        }

        Optional<Event> eventOpt = eventRepository.findById(eventId.intValue());
        if (!eventOpt.isPresent()) return ResponseEntity.badRequest().body("Event not found");
        Event event = eventOpt.get();

        // Check deadline
        if (event.getRegistrationDeadline() != null && event.getRegistrationDeadline().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Registration deadline has passed");
        }

        // Check if leader already registered
        if (registrationRepository.existsByUsernameAndEventId(leader.getUsername(), eventId.intValue())) {
            return ResponseEntity.badRequest().body("You have already registered for this event");
        }

        // Parse and validate team members
        List<Map<String, String>> teamMembers = new ArrayList<>();
        try {
            List<?> rawList = (List<?>) body.get("teamMembers");
            if (rawList != null) {
                for (Object item : rawList) {
                    teamMembers.add((Map<String, String>) item);
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid teamMembers format");
        }

        // Validate team size
        int count = teamMembers.size();
        if (count < event.getMinParticipants()) {
            return ResponseEntity.badRequest().body("Minimum " + event.getMinParticipants() + " participants required");
        }
        if (count > event.getMaxParticipants()) {
            return ResponseEntity.badRequest().body("Maximum " + event.getMaxParticipants() + " participants allowed");
        }

        // Validate all usernames exist in the portal
        List<String> invalidUsernames = new ArrayList<>();
        for (Map<String, String> member : teamMembers) {
            String uname = member.get("username");
            if (uname == null || uname.isBlank() || !userRepository.existsByUsername(uname.trim())) {
                invalidUsernames.add(uname != null ? uname : "(empty)");
            }
        }
        if (!invalidUsernames.isEmpty()) {
            return ResponseEntity.badRequest().body("The following portal usernames are not registered: " + String.join(", ", invalidUsernames));
        }

        // Build group ID and transaction context
        String upiId = body.containsKey("upiId") ? body.get("upiId").toString() : null;
        String groupId = "GROUP-" + System.currentTimeMillis();

        List<Registration> registrationsToSave = new ArrayList<>();
        for (Map<String, String> member : teamMembers) {
            Registration reg = Registration.builder()
                    .event(event)
                    .username(member.get("username"))
                    .transactionId(upiId)
                    .groupId(groupId)
                    .status("PENDING")
                    // qrcode could be populated here if there's an upload logic later
                    .build();
            registrationsToSave.add(reg);
        }

        registrationRepository.saveAll(registrationsToSave);

        // Fire notification to coordinator's college
        Integer collegeCode = event.getCollege() != null ? event.getCollege().getCollegeCode() : 0;
        String notifTitle = "New Registration Pending Approval";
        String notifMsg = String.format(
            "Student '%s' registered for '%s'. Team: %d member(s). UPI: %s. Group ID: %s",
            leader.getFullName() != null ? leader.getFullName() : leader.getUsername(),
            event.getTitle(),
            count,
            upiId != null ? upiId : "N/A",
            groupId
        );

        Notification notification = Notification.builder()
                .title(notifTitle)
                .message(notifMsg)
                .targetAudience("COLLEGE:" + collegeCode)
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of(
            "registrationId", groupId,
            "status", "PENDING",
            "message", "Registration submitted! Awaiting coordinator approval."
        ));
    }



    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) return ((UserDetails) principal).getUsername();
        return principal.toString();
    }
}

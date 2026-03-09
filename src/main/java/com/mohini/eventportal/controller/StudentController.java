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

        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) return ResponseEntity.badRequest().body("Event not found");
        Event event = eventOpt.get();

        // Check deadline
        if (event.getRegistrationDeadline() != null && event.getRegistrationDeadline().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Registration deadline has passed");
        }

        // Check if already registered
        if (registrationRepository.existsByStudentIdAndEventId(leader.getId(), eventId)) {
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

        // Build teamMembersJson
        String upiId = body.containsKey("upiId") ? body.get("upiId").toString() : null;
        String teamJson = buildTeamJson(teamMembers);

        // Create registration (PENDING)
        Registration registration = Registration.builder()
                .student(leader)
                .event(event)
                .upiId(upiId)
                .teamMembersJson(teamJson)
                .status(Registration.RegistrationStatus.PENDING)
                .build();

        Registration saved = registrationRepository.save(registration);

        // Fire notification to coordinator's college
        String collegeCode = event.getCollege() != null ? event.getCollege().getCollegeCode() : "UNKNOWN";
        String notifTitle = "New Registration Pending Approval";
        String notifMsg = String.format(
            "Student '%s' registered for '%s'. Team: %d member(s). UPI: %s. Registration ID: %s",
            leader.getFullName() != null ? leader.getFullName() : leader.getUsername(),
            event.getTitle(),
            count,
            upiId != null ? upiId : "N/A",
            saved.getRegistrationId()
        );

        Notification notification = Notification.builder()
                .title(notifTitle)
                .message(notifMsg)
                .targetAudience("COLLEGE:" + collegeCode)
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of(
            "registrationId", saved.getRegistrationId(),
            "status", saved.getStatus().name(),
            "message", "Registration submitted! Awaiting coordinator approval."
        ));
    }

    private String buildTeamJson(List<Map<String, String>> members) {
        // Simple manual JSON build to avoid Jackson dependency injection complexity
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < members.size(); i++) {
            Map<String, String> m = members.get(i);
            sb.append("{");
            sb.append("\"username\":\"").append(esc(m.get("username"))).append("\",");
            sb.append("\"name\":\"").append(esc(m.get("name"))).append("\",");
            sb.append("\"email\":\"").append(esc(m.get("email"))).append("\",");
            sb.append("\"college\":\"").append(esc(m.get("college"))).append("\",");
            sb.append("\"branch\":\"").append(esc(m.get("branch"))).append("\",");
            sb.append("\"year\":\"").append(esc(m.get("year"))).append("\"");
            sb.append("}");
            if (i < members.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private String esc(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) return ((UserDetails) principal).getUsername();
        return principal.toString();
    }
}

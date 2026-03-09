package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.College;
import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicController {

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EventRepository eventRepository;

    @GetMapping("/colleges")
    public List<College> getAllApprovedColleges() {
        return collegeRepository.findByEnabled(true);
    }

    /** Returns all events with college info — no auth needed */
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Event e : events) {
            result.add(toDto(e));
        }
        return ResponseEntity.ok(result);
    }

    /** Returns a single event by ID */
    @GetMapping("/events/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Integer id) {
        return eventRepository.findById(id)
            .map(e -> ResponseEntity.ok((Object) toDto(e)))
            .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toDto(Event e) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", e.getId());
        dto.put("title", e.getTitle());
        dto.put("description", e.getDescription());
        dto.put("category", e.getCategory());
        dto.put("organizedBy", e.getOrganizedBy());
        dto.put("eventDate", e.getEventDate());
        dto.put("registrationDeadline", e.getRegistrationDeadline());
        dto.put("venue", e.getVenue());
        dto.put("coordinatorName", e.getCoordinatorName());
        dto.put("coordinatorMobile", e.getCoordinatorMobile());
        dto.put("minParticipants", e.getMinParticipants());
        dto.put("maxParticipants", e.getMaxParticipants());
        dto.put("feePerPerson", e.getFeePerPerson());
        dto.put("requiresName", e.isRequiresName());
        dto.put("requiresEmail", e.isRequiresEmail());
        dto.put("requiresCollege", e.isRequiresCollege());
        dto.put("requiresPayment", e.isRequiresPayment());
        dto.put("requiresPhone", e.isRequiresPhone());
        dto.put("qrCodePath", e.getQrCodePath());
        dto.put("photosFolderPath", e.getPhotosFolderPath());
        
        // Add a thumbnail URL (the first image in the photos folder)
        String thumbnail = null;
        if (e.getPhotosFolderPath() != null) {
            File dir = new File(e.getPhotosFolderPath().substring(1)); // Remove leading / for file access
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles();
                if (files != null) {
                    for (File f : files) {
                        String name = f.getName().toLowerCase();
                        if (name.endsWith(".jpg") || name.endsWith(".jpeg") ||
                            name.endsWith(".png") || name.endsWith(".webp")) {
                            thumbnail = "/uploads/photos/" + e.getId() + "/" + f.getName();
                            break;
                        }
                    }
                }
            }
        }
        dto.put("thumbnailUrl", thumbnail);

        if (e.getCollege() != null) {
            Map<String, Object> college = new LinkedHashMap<>();
            college.put("collegeCode", e.getCollege().getCollegeCode());
            college.put("collegeName", e.getCollege().getCollegeName());
            college.put("district", e.getCollege().getDistrict());
            dto.put("college", college);
        } else {
            dto.put("college", null);
        }
        return dto;
    }

    /** Lists all photo URLs for a given event from its uploads/photos/{id}/ folder */
    @GetMapping("/events/{id}/photos")
    public ResponseEntity<?> getEventPhotos(@PathVariable Integer id) {
        File dir = new File("uploads/photos/" + id);
        List<String> urls = new ArrayList<>();
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    String name = f.getName().toLowerCase();
                    if (name.endsWith(".jpg") || name.endsWith(".jpeg") ||
                        name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif")) {
                        urls.add("/uploads/photos/" + id + "/" + f.getName());
                    }
                }
            }
        }
        return ResponseEntity.ok(urls);
    }

    /** Fetches student details for auto-filling registration forms */
    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
            .map(u -> {
                if (u.getRole() != com.mohini.eventportal.model.User.Role.STUDENT) {
                    return ResponseEntity.badRequest().body("User is not a student");
                }
                Map<String, Object> details = new HashMap<>();
                details.put("fullName", u.getFullName());
                details.put("email", u.getEmail());
                details.put("college", u.getCollege());
                details.put("phone", u.getPhone());
                return ResponseEntity.ok(details);
            })
            .orElse(ResponseEntity.status(404).body("User not registered on portal"));
    }

    @GetMapping("/validate-usernames")
    public ResponseEntity<?> validateUsernames(@RequestParam("usernames") String usernamesCsv) {
        String[] usernames = usernamesCsv.split(",");
        List<String> invalid = new ArrayList<>();
        for (String u : usernames) {
            String trimmed = u.trim();
            if (trimmed.isEmpty() || !userRepository.existsByUsername(trimmed)) {
                invalid.add(trimmed);
            }
        }
        if (invalid.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", true));
        } else {
            return ResponseEntity.ok(Map.of("valid", false, "invalid", invalid));
        }
    }
}

package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.College;
import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.model.Post;
import com.mohini.eventportal.model.PostLike;
import com.mohini.eventportal.model.User;
import com.mohini.eventportal.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

    @Autowired
    PostRepository postRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    PostLikeRepository postLikeRepository;

    @Autowired
    ObjectMapper objectMapper;

    @GetMapping("/colleges")
    public List<College> getAllApprovedColleges() {
        return collegeRepository.findByEnabled(true);
    }

    /**
     * Returns all events with college info — no auth needed, sorted by popularity
     */
    @GetMapping("/events")
    public ResponseEntity<?> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        List<Object[]> counts = registrationRepository.countAllRegistrationsPerEvent();
        Map<Integer, Long> countMap = new HashMap<>();
        for (Object[] row : counts) {
            countMap.put((Integer) row[0], (Long) row[1]);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Event e : events) {
            Map<String, Object> dto = toDto(e);
            dto.put("registrationCount", countMap.getOrDefault(e.getId(), 0L));
            result.add(dto);
        }

        // Sort by registration count descending
        result.sort((a, b) -> {
            Long c1 = (Long) a.get("registrationCount");
            Long c2 = (Long) b.get("registrationCount");
            return c2.compareTo(c1);
        });

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
        dto.put("requiresName", e.getRequiresName());
        dto.put("requiresEmail", e.getRequiresEmail());
        dto.put("requiresCollege", e.getRequiresCollege());
        dto.put("requiresPayment", e.getRequiresPayment());
        dto.put("requiresPhone", e.getRequiresPhone());
        dto.put("qrCodePath", e.getQrCodePath());
        dto.put("photosFolderPath", e.getPhotosFolderPath());

        // Add all photos URLs
        List<String> imageUrls = new ArrayList<>();
        if (e.getPhotosFolderPath() != null) {
            File dir = new File(getUploadBase() + "/photos/" + e.getId());
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles();
                if (files != null) {
                    for (File f : files) {
                        String name = f.getName().toLowerCase();
                        if (name.endsWith(".jpg") || name.endsWith(".jpeg") ||
                                name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif")) {
                            imageUrls.add("/uploads/photos/" + e.getId() + "/" + f.getName());
                        }
                    }
                }
            }
        }
        dto.put("imageUrls", imageUrls);
        dto.put("thumbnailUrl", imageUrls.isEmpty() ? null : imageUrls.get(0));

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

    /**
     * Lists all photo URLs for a given event from its uploads/photos/{id}/ folder
     */
    @GetMapping("/events/{id}/photos")
    public ResponseEntity<?> getEventPhotos(@PathVariable Integer id) {
        // Use absolute path to correctly resolve the directory on Windows
        File dir = new File(getUploadBase() + "/photos/" + id);
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

    @GetMapping("/posts")
    public ResponseEntity<?> getLatestPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post p : posts) {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", p.getId());
            dto.put("eventTitle", p.getEvent() != null ? p.getEvent().getTitle() : "Event");
            dto.put("description", p.getCaption());
            dto.put("createdAt", p.getCreatedAt());
            dto.put("likes", p.getLikes());
            dto.put("feedbackFormLink", p.getFeedbackFormLink());

            // Add college name
            String collegeName = "UniEvent College";
            if (p.getEvent() != null && p.getEvent().getCollege() != null) {
                collegeName = p.getEvent().getCollege().getCollegeName();
            }
            dto.put("collegeName", collegeName);

            try {
                if (p.getImages() != null && !p.getImages().isEmpty()) {
                    dto.put("imageUrls", objectMapper.readValue(p.getImages(), new TypeReference<List<String>>() {
                    }));
                } else if (p.getPhoto() != null) {
                    dto.put("imageUrls", Arrays.asList(p.getPhoto().split(",")));
                } else {
                    dto.put("imageUrls", Collections.emptyList());
                }
            } catch (Exception e) {
                dto.put("imageUrls", Collections.emptyList());
            }
            result.add(dto);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Integer id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if ("anonymousUser".equals(principal)) {
            return ResponseEntity.status(401).body(Map.of("message", "Please log in to like posts"));
        }

        String username = ((UserDetails) principal).getUsername();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent())
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        User user = userOpt.get();

        return postRepository.findById(id).map(p -> {
            if (postLikeRepository.existsByPostAndUser(p, user)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "You already liked this post", "likes", p.getLikes()));
            }

            // Save the like record
            PostLike like = PostLike.builder()
                    .post(p)
                    .user(user)
                    .build();
            postLikeRepository.save(like);

            // Increment like count
            p.setLikes((p.getLikes() == null ? 0 : p.getLikes()) + 1);
            postRepository.save(p);

            return ResponseEntity.ok(Map.of("likes", p.getLikes(), "message", "Liked successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}

package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.Event;
import com.mohini.eventportal.model.Post;
import com.mohini.eventportal.model.College;
import com.mohini.eventportal.model.Registration;
import com.mohini.eventportal.model.Notification;
import com.mohini.eventportal.repository.UserRepository;
import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.RegistrationRepository;
import com.mohini.eventportal.repository.PostRepository;
import com.mohini.eventportal.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/coordinator")
public class CoordinatorController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    RegistrationRepository registrationRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getDashboardStats() {
        College college = getCurrentCollege();
        if (college == null) {
            return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(0, 0, 0, 0));
        }

        String collegeCode = college.getCollegeCode();
        long totalEvents = eventRepository.countByCollege_CollegeCode(collegeCode);
        long presentEvents = eventRepository.findByCollege_CollegeCode(collegeCode).stream()
                .filter(e -> e.getEventDate().isAfter(java.time.LocalDateTime.now())).count();
        long pastEvents = eventRepository.findByCollege_CollegeCode(collegeCode).stream()
                .filter(e -> e.getEventDate().isBefore(java.time.LocalDateTime.now())).count();
        long totalRegistrations = registrationRepository.countByEvent_College_CollegeCode(collegeCode);

        return ResponseEntity.ok(new com.mohini.eventportal.dto.DashboardStats(totalEvents, presentEvents, pastEvents,
                totalRegistrations));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getEvents() {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.ok(java.util.Collections.emptyList());
        
        java.util.List<Event> events = eventRepository.findByCollege_CollegeCode(college.getCollegeCode());
        for (Event e : events) {
            java.util.List<String> urls = new java.util.ArrayList<>();
            if (e.getPhotosFolderPath() != null) {
                java.io.File dir = new java.io.File(getUploadBase() + "/photos/" + e.getId());
                if (dir.exists() && dir.isDirectory()) {
                    java.io.File[] files = dir.listFiles();
                    if (files != null) {
                        for (java.io.File f : files) {
                            String name = f.getName().toLowerCase();
                            if (name.endsWith(".jpg") || name.endsWith(".jpeg") ||
                                name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif")) {
                                urls.add("/uploads/photos/" + e.getId() + "/" + f.getName());
                            }
                        }
                    }
                }
            }
            e.setImageUrls(urls);
            if (!urls.isEmpty()) {
                e.setThumbnailUrl(urls.get(0));
            }
        }
        return ResponseEntity.ok(events);
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getRegistrations() {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.ok(java.util.Collections.emptyList());

        java.util.List<Registration> rawRegs = registrationRepository
                .findByEvent_College_CollegeCode(college.getCollegeCode());
        
        // Sort registrations by date desc if available
        rawRegs.sort((a, b) -> {
            if (a.getRegistrationDate() == null || b.getRegistrationDate() == null) return 0;
            return b.getRegistrationDate().compareTo(a.getRegistrationDate());
        });

        java.util.List<Map<String, Object>> dtos = new java.util.ArrayList<>();
        java.util.Set<String> seenGroups = new java.util.HashSet<>();
        for (Registration r : rawRegs) {
            if (r.getGroupId() != null && !seenGroups.add(r.getGroupId()))
                continue;
            
            Map<String, Object> dto = new java.util.HashMap<>();
            dto.put("id", r.getGroupId());
            dto.put("status", r.getStatus());

            userRepository.findByUsername(r.getUsername()).ifPresent(u -> {
                dto.put("studentName", u.getFullName());
                dto.put("studentEmail", u.getEmail());
                dto.put("studentPhone", u.getPhone());
                dto.put("studentDistrict", u.getDistrict());
            });

            Map<String, Object> eventDto = new java.util.HashMap<>();
            if (r.getEvent() != null) {
                eventDto.put("title", r.getEvent().getTitle());
                eventDto.put("category", r.getEvent().getCategory());
            } else {
                eventDto.put("title", "Unknown");
            }
            dto.put("event", eventDto);
            dto.put("status", r.getStatus());
            dto.put("registrationDate", r.getRegistrationDate());
            dtos.add(dto);
        }
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/registrations/pending")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getPendingRegistrations() {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.ok(java.util.Collections.emptyList());

        java.util.List<Registration> rawRegs = registrationRepository
                .findByEvent_College_CollegeCode(college.getCollegeCode());
        
        // Sort registrations by date desc if available
        rawRegs.sort((a, b) -> {
            if (a.getRegistrationDate() == null || b.getRegistrationDate() == null) return 0;
            return b.getRegistrationDate().compareTo(a.getRegistrationDate());
        });

        java.util.List<Map<String, Object>> dtos = new java.util.ArrayList<>();
        java.util.Set<String> seenGroups = new java.util.HashSet<>();
        for (Registration r : rawRegs) {
            if (r.getGroupId() != null && !seenGroups.add(r.getGroupId()))
                continue;

            Map<String, Object> dto = new java.util.HashMap<>();
            dto.put("id", r.getGroupId());
            dto.put("groupId", r.getGroupId());
            dto.put("status", r.getStatus());

            userRepository.findByUsername(r.getUsername()).ifPresent(u -> {
                dto.put("studentName", u.getFullName());
                dto.put("studentEmail", u.getEmail());
                dto.put("studentPhone", u.getPhone());
                dto.put("studentDistrict", u.getDistrict());
            });

            Map<String, Object> eventDto = new java.util.HashMap<>();
            if (r.getEvent() != null) {
                eventDto.put("title", r.getEvent().getTitle());
                eventDto.put("category", r.getEvent().getCategory());
            } else {
                eventDto.put("title", "Unknown");
            }
            dto.put("event", eventDto);
            dto.put("upiId", r.getTransactionId());
            dto.put("registrationDate", r.getRegistrationDate());

            dtos.add(dto);
        }
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/registrations/group/{groupId}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getRegistrationGroupDetails(@PathVariable String groupId) {
        College college = getCurrentCollege();
        if (college == null) return ResponseEntity.status(403).body("Unauthorized");

        java.util.List<Registration> regs = registrationRepository.findByGroupId(groupId);
        if (regs.isEmpty()) return ResponseEntity.notFound().build();

        Registration first = regs.get(0);
        if (!first.getEvent().getCollege().getCollegeCode().equals(college.getCollegeCode())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("groupId", groupId);
        response.put("status", first.getStatus());
        response.put("transactionId", first.getTransactionId());
        response.put("eventTitle", first.getEvent().getTitle());
        response.put("feePerPerson", first.getEvent().getFeePerPerson());

        // Only using file-based path since qrcode column was removed
        if (first.getPaymentScreenshotPath() != null) {
            response.put("paymentScreenshot", first.getPaymentScreenshotPath());
        }

        // Fetch user profiles for all members
        java.util.List<Map<String, Object>> members = new java.util.ArrayList<>();
        for (Registration r : regs) {
            Map<String, Object> m = new java.util.HashMap<>();
            m.put("username", r.getUsername());
            userRepository.findByUsername(r.getUsername()).ifPresent(u -> {
                m.put("fullName", u.getFullName());
                m.put("email", u.getEmail());
                m.put("phone", u.getPhone());
                m.put("college", u.getCollege());
            });
            members.add(m);
        }
        response.put("members", members);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/registrations/{id}/reject")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> rejectRegistration(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : null;
        return updateRegistrationStatus(id, "DENIED", reason);
    }

    @PostMapping("/registrations/{id}/approve")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> approveRegistration(@PathVariable String id) {
        return updateRegistrationStatus(id, "APPROVED", null);
    }

    @org.springframework.transaction.annotation.Transactional
    protected ResponseEntity<?> updateRegistrationStatus(String groupId, String newStatus, String reason) {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.badRequest().body("Coordinator not found");

        java.util.List<Registration> regs = registrationRepository.findByGroupId(groupId);
        if (regs.isEmpty())
            return ResponseEntity.badRequest().body("Registration not found");

        if (!regs.get(0).getEvent().getCollege().getCollegeCode().equals(college.getCollegeCode())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        if ("DENIED".equals(newStatus)) {
            // Send denial notification
            for (Registration reg : regs) {
                reg.setStatus("DENIED");
                reg.setReason(reason);
                userRepository.findByUsername(reg.getUsername()).ifPresent(u -> {
                    String msg = "Your registration for '" + reg.getEvent().getTitle() + "' was rejected by the coordinator.";
                    if (reason != null && !reason.trim().isEmpty()) {
                        msg += " Reason: " + reason;
                    }
                    Notification n = Notification.builder()
                        .title("Registration Rejected")
                        .message(msg)
                        .recipient(u)
                        .targetAudience("USER:" + u.getUsername())
                        .build();
                    notificationRepository.save(n);
                });
            }
            registrationRepository.saveAll(regs);
            return ResponseEntity.ok(Map.of("status", "DENIED"));
        } else {
            for (Registration reg : regs) {
                reg.setStatus(newStatus);
                // Send approval notification
                userRepository.findByUsername(reg.getUsername()).ifPresent(u -> {
                    Notification n = Notification.builder()
                        .title("Registration Approved!")
                        .message("Your registration for '" + reg.getEvent().getTitle() + "' has been approved. You can now view full details in your portal.")
                        .recipient(u)
                        .targetAudience("USER:" + u.getUsername())
                        .build();
                    notificationRepository.save(n);
                });
            }
            registrationRepository.saveAll(regs);
            return ResponseEntity.ok(Map.of("status", newStatus));
        }
    }

    @GetMapping("/notifications")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getNotifications() {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.ok(java.util.Collections.emptyList());
        return ResponseEntity.ok(
                notificationRepository
                        .findByTargetAudienceContainingOrderBySentAtDesc("COLLEGE:" + college.getCollegeCode()));
    }

    @GetMapping("/posts")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getPosts() {
        College college = getCurrentCollege();
        if (college == null) return ResponseEntity.status(403).body("Unauthorized");
        return ResponseEntity.ok(postRepository.findByEvent_College_CollegeCodeOrderByCreatedAtDesc(college.getCollegeCode()));
    }

    @GetMapping("/events/eligible-for-post")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> getEligibleEvents() {
        College college = getCurrentCollege();
        if (college == null) return ResponseEntity.status(403).body("Unauthorized");
        
        // Use a 1-day buffer to show events that were today or yesterday
        java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().plusDays(1);
        java.util.List<Event> eligible = eventRepository.findByCollege_CollegeCode(college.getCollegeCode()).stream()
                .filter(e -> e.getEventDate().isBefore(cutoff))
                .filter(e -> !postRepository.findByEvent(e).isPresent())
                .collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(eligible);
    }

    @PostMapping("/events")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createEvent(@RequestBody Event eventData) {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.badRequest().body("Coordinator profile not found");

        Event event = Event.builder()
                .title(eventData.getTitle())
                .description(eventData.getDescription())
                .category(eventData.getCategory())
                .organizedBy(eventData.getOrganizedBy())
                .eventDate(eventData.getEventDate())
                .venue(eventData.getVenue())
                .coordinatorName(eventData.getCoordinatorName())
                .coordinatorMobile(eventData.getCoordinatorMobile())
                .minParticipants(eventData.getMinParticipants())
                .maxParticipants(eventData.getMaxParticipants())
                .feePerPerson(eventData.getFeePerPerson())
                .registrationDeadline(eventData.getRegistrationDeadline())
                .requiresName(eventData.isRequiresName())
                .requiresEmail(eventData.isRequiresEmail())
                .requiresCollege(eventData.isRequiresCollege())
                .requiresPayment(eventData.isRequiresPayment())
                .college(college)
                .status(Event.EventStatus.PUBLISHED)
                .build();

        Event saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/events/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateEvent(@PathVariable Integer id, @RequestBody Event eventData) {
        College college = getCurrentCollege();
        if (college == null) return ResponseEntity.status(403).body("Unauthorized");

        Optional<Event> opt = eventRepository.findById(id);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Event event = opt.get();
        if (!event.getCollege().getCollegeCode().equals(college.getCollegeCode())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        if (eventData.getRegistrationDeadline() != null) event.setRegistrationDeadline(eventData.getRegistrationDeadline());
        if (eventData.getEventDate() != null) event.setEventDate(eventData.getEventDate());
        if (eventData.getCoordinatorName() != null) event.setCoordinatorName(eventData.getCoordinatorName());
        if (eventData.getCoordinatorMobile() != null) event.setCoordinatorMobile(eventData.getCoordinatorMobile());
        if (eventData.getDescription() != null) event.setDescription(eventData.getDescription());

        eventRepository.save(event);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/events/{eventId}/qr")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> uploadQrCode(@PathVariable Integer eventId, @RequestParam("qr") MultipartFile qrFile) {
        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.badRequest().body("Coordinator not found");

        Optional<Event> optEvent = eventRepository.findById(eventId);
        if (!optEvent.isPresent())
            return ResponseEntity.badRequest().body("Event not found");

        Event event = optEvent.get();
        if (!event.getCollege().getCollegeCode().equals(college.getCollegeCode())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        try {
            // Store in uploads/qr/{eventId}/ folder using absolute path
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(getUploadBase(), "qr", String.valueOf(eventId));
            java.nio.file.Files.createDirectories(uploadPath);
            
            String filename = "qr_" + System.currentTimeMillis() + "." + getExtension(qrFile.getOriginalFilename());
            java.nio.file.Path dest = uploadPath.resolve(filename);
            
            java.nio.file.Files.copy(qrFile.getInputStream(), dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            // Store URL path in qrcode_path using atomic update to avoid race conditions
            String urlPath = "/uploads/qr/" + eventId + "/" + filename;
            eventRepository.updateQrCodePath(eventId, urlPath);
            return ResponseEntity.ok(Map.of("qrCodePath", urlPath));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Failed to upload QR: " + ex.getMessage());
        }
    }
    /**
     * POST /api/coordinator/events/{eventId}/photos
     * Upload event photos (multiple files). Saves to uploads/photos/{eventId}/
     */
    @PostMapping("/events/{eventId}/photos")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> uploadEventPhotos(
            @PathVariable Integer eventId,
            @RequestParam("photos") java.util.List<MultipartFile> photos) {

        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.badRequest().body("Coordinator not found");

        Optional<Event> optEvent = eventRepository.findById(eventId);
        if (!optEvent.isPresent())
            return ResponseEntity.badRequest().body("Event not found");

        Event event = optEvent.get();
        if (!event.getCollege().getCollegeCode().equals(college.getCollegeCode()))
            return ResponseEntity.status(403).body("Unauthorized");

        if (photos.size() > 10)
            return ResponseEntity.badRequest().body("Maximum 10 photos allowed");

        // Use absolute path to avoid Windows working-directory issues
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(getUploadBase(), "photos", String.valueOf(eventId));
        try {
            java.nio.file.Files.createDirectories(uploadPath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create upload directory: " + e.getMessage());
        }

        java.util.List<String> savedPaths = new java.util.ArrayList<>();
        for (MultipartFile photo : photos) {
            if (photo.isEmpty()) continue;
            try {
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                java.nio.file.Path dest = uploadPath.resolve(filename);
                java.nio.file.Files.copy(photo.getInputStream(), dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                savedPaths.add("/uploads/photos/" + eventId + "/" + filename);
            } catch (Exception ex) {
                return ResponseEntity.status(500).body("Failed to upload photo: " + ex.getMessage());
            }
        }

        // Store URL path in photos_folder_path using atomic update to avoid race conditions
        String folderPath = "/uploads/photos/" + eventId;
        eventRepository.updatePhotosFolderPath(eventId, folderPath);
        return ResponseEntity.ok(Map.of(
            "photosFolderPath", folderPath,
            "uploadedFiles", savedPaths
        ));
    }

    /**
     * DELETE /api/coordinator/events/{eventId}/photos/{filename}
     * Delete a specific photo from the event folder.
     */
    @DeleteMapping("/events/{eventId}/photos/{filename}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> deleteEventPhoto(
            @PathVariable Integer eventId,
            @PathVariable String filename) {

        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.status(403).body("Coordinator not found");

        Optional<Event> optEvent = eventRepository.findById(eventId);
        if (!optEvent.isPresent()) return ResponseEntity.notFound().build();

        Event event = optEvent.get();
        if (!event.getCollege().getCollegeCode().equals(college.getCollegeCode()))
            return ResponseEntity.status(403).body("Unauthorized");

        File file = new File(getUploadBase() + "/photos/" + eventId + "/" + filename);
        if (file.exists()) file.delete();
        return ResponseEntity.ok(Map.of("deleted", filename));
    }

    /** Returns the absolute base path for uploads, ensuring it's relative to the project root */
    private String getUploadBase() {
        String userDir = System.getProperty("user.dir");
        java.io.File uploads = new java.io.File(userDir, "uploads");
        if (!uploads.exists()) {
            uploads.mkdirs();
        }
        return uploads.getAbsolutePath();
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    @PostMapping("/events/{eventId}/afterpost")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> createAfterPost(
            @PathVariable Integer eventId,
            @RequestParam("caption") String caption,
            @RequestParam(value = "feedbackFormLink", required = false) String feedbackFormLink,
            @RequestParam("photos") java.util.List<org.springframework.web.multipart.MultipartFile> photos) {

        College college = getCurrentCollege();
        if (college == null)
            return ResponseEntity.badRequest().body("Coordinator profile not found");

        Optional<Event> optEvent = eventRepository.findById(eventId);
        if (!optEvent.isPresent())
            return ResponseEntity.badRequest().body("Event not found");

        Event event = optEvent.get();
        if (!event.getCollege().getCollegeCode().equals(college.getCollegeCode())) {
            return ResponseEntity.status(403).body("Unauthorized to post for this event");
        }

        // Constraint: Event must be in the past
        if (event.getEventDate().isAfter(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Posts can only be created for past events.");
        }

        // Constraint: Unique post per event
        if (postRepository.findByEvent(event).isPresent()) {
            return ResponseEntity.badRequest().body("A post already exists for this event.");
        }

        if (photos.size() > 10)
            return ResponseEntity.badRequest().body("Maximum 10 photos allowed");

        // Use absolute path: uploads/afterposts/{event_id}/
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(getUploadBase(), "afterposts", String.valueOf(eventId));
        try {
            java.nio.file.Files.createDirectories(uploadPath);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to create upload directory: " + e.getMessage());
        }

        java.util.List<String> photoPaths = new java.util.ArrayList<>();
        for (org.springframework.web.multipart.MultipartFile photo : photos) {
            if (photo.isEmpty()) continue;
            try {
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                java.nio.file.Path dest = uploadPath.resolve(filename);
                java.nio.file.Files.copy(photo.getInputStream(), dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                photoPaths.add("/uploads/afterposts/" + eventId + "/" + filename);
            } catch (Exception ex) {
                return ResponseEntity.status(500).body("Failed to upload photos: " + ex.getMessage());
            }
        }

        Post post = Post.builder()
                .event(event)
                .caption(caption)
                .feedbackFormLink(feedbackFormLink)
                .photo(String.join(",", photoPaths))
                .build();

        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "After-event post created successfully"));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> data) {
        College college = getCurrentCollege();
        if (college == null) return ResponseEntity.status(403).body("Unauthorized");

        String newUsername = data.get("username");
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(college.getUsername())) {
            if (collegeRepository.existsByUsername(newUsername)) {
                return ResponseEntity.badRequest().body("Username already taken");
            }
            college.setUsername(newUsername);
        }

        if (data.containsKey("fullName")) college.setCoordinatorName(data.get("fullName"));
        if (data.containsKey("phone")) college.setPhone(data.get("phone"));
        if (data.containsKey("district")) college.setDistrict(data.get("district"));

        String newPassword = data.get("password");
        if (newPassword != null && !newPassword.isEmpty()) {
            college.setPassword(passwordEncoder.encode(newPassword));
        }

        collegeRepository.save(college);
        
        // Return updated data for frontend to sync
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("fullName", college.getCoordinatorName());
        response.put("username", college.getUsername());
        response.put("phone", college.getPhone());
        response.put("district", college.getDistrict());
        
        return ResponseEntity.ok(response);
    }

    private College getCurrentCollege() {
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

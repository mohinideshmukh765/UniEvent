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

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalColleges", collegeRepository.count());
        stats.put("totalStudents", userRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalRegistrations", registrationRepository.count());
        
        return ResponseEntity.ok(stats);
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

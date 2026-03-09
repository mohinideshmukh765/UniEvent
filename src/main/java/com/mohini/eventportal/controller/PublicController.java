package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.College;
import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicController {

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/colleges")
    public List<College> getAllApprovedColleges() {
        return collegeRepository.findByEnabled(true);
    }

    /**
     * GET /api/public/validate-usernames?usernames=alice,bob,charlie
     * Returns { valid: true } if all usernames exist, or { valid: false, invalid: ["bob"] }
     */
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

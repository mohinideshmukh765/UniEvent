package com.mohini.eventportal.controller;

import com.mohini.eventportal.repository.CollegeRepository;
import com.mohini.eventportal.repository.EventRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/data")
    public Map<String, Object> debugData() {
        Map<String, Object> result = new HashMap<>();

        List<Map<String, String>> colleges = collegeRepository.findAll().stream().map(c -> {
            Map<String, String> m = new HashMap<>();
            m.put("collegeCode", c.getCollegeCode());
            m.put("username", c.getUsername());
            m.put("name", c.getCollegeName());
            return m;
        }).collect(Collectors.toList());
        result.put("colleges", colleges);

        List<Map<String, Object>> events = eventRepository.findAll().stream().map(e -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", e.getId());
            m.put("title", e.getTitle());
            m.put("collegeCode", e.getCollege() != null ? e.getCollege().getCollegeCode() : "NULL");
            return m;
        }).collect(Collectors.toList());
        result.put("events", events);

        List<Map<String, String>> coordinators = userRepository.findAll().stream()
                .map(u -> {
                    Map<String, String> m = new HashMap<>();
                    m.put("username", u.getUsername());
                    m.put("role", u.getRole() != null ? u.getRole().name() : "NULL");
                    return m;
                }).collect(Collectors.toList());
        result.put("coordinators", coordinators);

        return result;
    }
}

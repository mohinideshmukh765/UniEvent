package com.mohini.eventportal.controller;

import com.mohini.eventportal.model.College;
import com.mohini.eventportal.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired
    CollegeRepository collegeRepository;

    @GetMapping("/colleges")
    public List<College> getAllApprovedColleges() {
        return collegeRepository.findByStatus(College.CollegeStatus.APPROVED);
    }
}

package com.mohini.eventportal.service;

import com.mohini.eventportal.model.Category;
import com.mohini.eventportal.model.District;
import com.mohini.eventportal.model.User;
import com.mohini.eventportal.repository.CategoryRepository;
import com.mohini.eventportal.repository.DistrictRepository;
import com.mohini.eventportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Districts
        if (districtRepository.count() == 0) {
            List<String> districts = Arrays.asList("Kolhapur", "Sangli", "Satara");
            districts.forEach(name -> districtRepository.save(District.builder().name(name).build()));
        }

        // Initialize Categories
        if (categoryRepository.count() == 0) {
            List<String> categories = Arrays.asList("Technical", "Cultural", "Sports", "Workshop", "Hackathon", "Seminar");
            categories.forEach(name -> categoryRepository.save(Category.builder().name(name).build()));
        }

        // Initialize Admin User
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@eventportal.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .role(User.Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
        }
    }
}

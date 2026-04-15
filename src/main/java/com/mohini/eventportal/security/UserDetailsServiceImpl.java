package com.mohini.eventportal.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    com.mohini.eventportal.repository.UserRepository userRepository;

    @Autowired
    com.mohini.eventportal.repository.CollegeRepository collegeRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try regular users table (Admin, Student)
        java.util.Optional<com.mohini.eventportal.model.User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            com.mohini.eventportal.model.User user = userOpt.get();
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    user.isEnabled(),
                    true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        }

        // If not found, try Colleges table (Coordinator)
        return collegeRepository.findByUsername(username)
                .map(college -> new org.springframework.security.core.userdetails.User(
                        college.getUsername(),
                        college.getPassword(),
                        Boolean.TRUE.equals(college.getEnabled()), // safe null-check
                        true, true, true,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_COORDINATOR"))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
    }
}

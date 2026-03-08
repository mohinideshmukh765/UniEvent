package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, String> {
    List<College> findByDistrict(String district);
    List<College> findByEnabled(Boolean enabled);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT c.collegeCode) FROM College c")
    long countDistinctCollegeCode();

    boolean existsByCollegeCode(String collegeCode);
    Optional<College> findByCollegeCode(String collegeCode);
    Optional<College> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}

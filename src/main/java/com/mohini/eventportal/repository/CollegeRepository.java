package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    List<College> findByDistrict(String district);
    List<College> findByStatus(College.CollegeStatus status);
}

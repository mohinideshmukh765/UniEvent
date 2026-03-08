package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);
    List<Registration> findByEventId(Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    
    long countByEventCollegeCollegeCode(String collegeCode);
    List<Registration> findByEventCollegeCollegeCode(String collegeCode);
}

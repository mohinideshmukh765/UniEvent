package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Registration.RegistrationId> {
    List<Registration> findByUsername(String username);
    List<Registration> findByEventId(Integer eventId);
    boolean existsByUsernameAndEventId(String username, Integer eventId);
    
    long countByEventCollegeCollegeCode(Integer collegeCode);
    List<Registration> findByEventCollegeCollegeCode(Integer collegeCode);
    List<Registration> findByEventCollegeCollegeCodeAndStatus(Integer collegeCode, String status);
    
    List<Registration> findByGroupId(String groupId);
    void deleteByGroupId(String groupId);
}

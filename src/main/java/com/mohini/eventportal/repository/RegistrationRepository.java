package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Registration.RegistrationId> {
    List<Registration> findByUsername(String username);
    List<Registration> findByEvent_Id(Integer eventId);
    boolean existsByUsernameAndEvent_Id(String username, Integer eventId);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.college.collegeCode = :collegeCode")
    long countByEvent_College_CollegeCode(@Param("collegeCode") String collegeCode);

    @Query("SELECT r FROM Registration r WHERE r.event.college.collegeCode = :collegeCode")
    List<Registration> findByEvent_College_CollegeCode(@Param("collegeCode") String collegeCode);

    @Query("SELECT r FROM Registration r WHERE r.status = :status AND r.event.college.collegeCode = :collegeCode")
    List<Registration> findByStatusAndEvent_College_CollegeCode(@Param("status") String status, @Param("collegeCode") String collegeCode);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.status = :status AND r.event.college.collegeCode = :collegeCode")
    long countByStatusAndEvent_College_CollegeCode(@Param("status") String status, @Param("collegeCode") String collegeCode);
    
    List<Registration> findByGroupId(String groupId);
    
    @Modifying
    @Transactional
    void deleteByGroupId(String groupId);

    @Query("SELECT COALESCE(MAX(CAST(r.groupId AS integer)), 0) FROM Registration r")
    Integer findMaxGroupId();

    @Query("SELECT r.event.id, COUNT(r) FROM Registration r GROUP BY r.event.id")
    List<Object[]> countAllRegistrationsPerEvent();
}

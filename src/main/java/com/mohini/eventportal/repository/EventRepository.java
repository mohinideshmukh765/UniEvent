package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("SELECT e FROM Event e WHERE e.college.collegeCode = :collegeCode")
    List<Event> findByCollege_CollegeCode(@Param("collegeCode") String collegeCode);

    List<Event> findByCategory(String category);

    @Query("SELECT COUNT(e) FROM Event e WHERE e.college.collegeCode = :collegeCode")
    long countByCollege_CollegeCode(@Param("collegeCode") String collegeCode);

    long countByEventDateAfter(java.time.LocalDateTime date);
    long countByEventDateBefore(java.time.LocalDateTime date);

    @Query("SELECT e FROM Event e WHERE e.eventDate > :date")
    List<Event> findUpcomingEvents(@Param("date") java.time.LocalDateTime date);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Event e SET e.qrCodePath = :path WHERE e.id = :id")
    void updateQrCodePath(@Param("id") Integer id, @Param("path") String path);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Event e SET e.photosFolderPath = :path WHERE e.id = :id")
    void updatePhotosFolderPath(@Param("id") Integer id, @Param("path") String path);
}

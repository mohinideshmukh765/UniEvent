package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCollegeCollegeCode(String collegeCode);
    List<Event> findByCategory(String category);
    List<Event> findByStatus(Event.EventStatus status);

    long countByCollegeCollegeCode(String collegeCode);
    long countByCollegeCollegeCodeAndStatus(String collegeCode, Event.EventStatus status);

    long countByEventDateAfter(java.time.LocalDateTime date);
    long countByEventDateBefore(java.time.LocalDateTime date);
    List<Event> findByStatusAndEventDateAfter(Event.EventStatus status, java.time.LocalDateTime date);
}

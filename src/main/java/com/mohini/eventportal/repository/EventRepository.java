package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCollegeId(Long collegeId);
    List<Event> findByCategory(String category);
    List<Event> findByStatus(Event.EventStatus status);
}

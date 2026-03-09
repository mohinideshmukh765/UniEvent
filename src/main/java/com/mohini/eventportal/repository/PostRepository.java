package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Post;
import com.mohini.eventportal.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    Optional<Post> findByEvent(Event event);
    java.util.List<Post> findAllByOrderByCreatedAtDesc();
    java.util.List<Post> findByEvent_College_CollegeCodeOrderByCreatedAtDesc(String collegeCode);
}

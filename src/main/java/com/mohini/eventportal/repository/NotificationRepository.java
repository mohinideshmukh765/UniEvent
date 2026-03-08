package com.mohini.eventportal.repository;

import com.mohini.eventportal.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderBySentAtDesc(Long recipientId);
    List<Notification> findByTargetAudienceContainingOrderBySentAtDesc(String audience);
}

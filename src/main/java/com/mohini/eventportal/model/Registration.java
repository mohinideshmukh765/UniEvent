package com.mohini.eventportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;

    private String registrationId; // Unique reference

    private LocalDateTime registrationDate;

    // UPI ID used by the team leader for payment
    private String upiId;

    // JSON string: list of { username, name, email, college, branch, year } for all team members
    @Column(columnDefinition = "TEXT")
    private String teamMembersJson;

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        if (registrationId == null) {
            registrationId = "REG-" + System.currentTimeMillis();
        }
    }

    public enum RegistrationStatus {
        PENDING, REGISTERED, APPROVED, WAITLISTED, COMPLETED, REJECTED, CANCELLED
    }
}

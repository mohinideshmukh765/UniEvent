package com.mohini.eventportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    private String category;

    @NotBlank
    private String organizedBy;

    @NotNull
    private LocalDateTime eventDate;

    @NotBlank
    private String venue;

    @NotBlank
    private String coordinatorName;

    @NotBlank
    private String coordinatorMobile;

    private int maxParticipants;

    private int minParticipants;

    private double feePerPerson;

    private String qrCodePath; // Path to UPI QR code image

    private LocalDateTime registrationDeadline;

    private String posterPath;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "events"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id")
    private College college;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.PUBLISHED;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum EventStatus {
        DRAFT, PUBLISHED, COMPLETED, CANCELLED, SUSPENDED
    }
}

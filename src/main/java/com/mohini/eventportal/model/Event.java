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
@Table(name = "event", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer id;

    @NotBlank
    @Column(name = "title")
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", name = "description")
    private String description;

    @NotBlank
    @Column(name = "category")
    private String category;

    @NotBlank
    @Column(name = "organized_by")
    private String organizedBy;

    @NotNull
    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @NotBlank
    @Column(name = "location")
    private String venue;

    @NotBlank
    @Column(name = "event_coordinator_name")
    private String coordinatorName;

    @NotBlank
    @Column(name = "event_coordinator_phone")
    private String coordinatorMobile;

    @Column(name = "max_participant")
    private int maxParticipants;

    @Column(name = "min_participant")
    private int minParticipants;

    @Column(name = "event_fee_per_person")
    private double feePerPerson;

    // This column does not exist in the public.event SQL table schema provided by the user. 
    // We'll mark it Transient so Hibernate ignores it, OR if they need it, they might need to add it later.
    @Transient
    private String qrCodePath; 

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    // This column does not exist in the public.event schema provided. Marking transient.
    @Transient 
    private String posterPath;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "events"})
    @ManyToOne(fetch = FetchType.LAZY)
    // There is no college_id in the event table schema provided. 
    // We mark this transient or ignore unless they add it to the table mapping.
    @JoinColumn(name = "college_id")
    @Transient
    private College college;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Transient
    private EventStatus status = EventStatus.PUBLISHED;

    @Transient
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum EventStatus {
        DRAFT, PUBLISHED, COMPLETED, CANCELLED, SUSPENDED
    }
}

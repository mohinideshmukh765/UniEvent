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

    @Column(name = "qrcode_path")
    private String qrCodePath;

    @Column(name = "photos_folder_path")
    private String photosFolderPath;

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    @Builder.Default
    @Column(name = "requires_name")
    private boolean requiresName = true;

    @Builder.Default
    @Column(name = "requires_email")
    private boolean requiresEmail = true;

    @Builder.Default
    @Column(name = "requires_college")
    private boolean requiresCollege = true;

    @Builder.Default
    @Column(name = "requires_phone")
    private boolean requiresPhone = true;

    @Builder.Default
    @Column(name = "requires_payment")
    private boolean requiresPayment = false;



    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "events"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_code")
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

package com.mohini.eventportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String message;

    private String targetAudience; // e.g., "ALL", "STUDENTS", "COLLEGES", "DISTRICT:Kolhapur"

    private LocalDateTime sentAt;

    @Builder.Default
    private boolean readStatus = false;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User recipient; // Optional: if null, it's a broadcast

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}

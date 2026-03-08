package com.mohini.eventportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "colleges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(unique = true)
    private String collegeCode;

    @NotBlank
    private String city;

    @NotBlank
    private String district;

    @NotBlank
    private String address;

    private String universityAffiliation;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private CollegeStatus status = CollegeStatus.PENDING;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum CollegeStatus {
        PENDING, APPROVED, REJECTED, DISABLED
    }
}

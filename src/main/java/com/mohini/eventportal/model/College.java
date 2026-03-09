package com.mohini.eventportal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "colleges", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College {

    @Id
    @Column(name = "college_code")
    private String collegeCode;

    @NotBlank
    @Column(name = "name")
    private String collegeName;

    @Column(name = "coordinator_name")
    private String coordinatorName;

    @Column(name = "phone")
    private String phone;

    @NotBlank
    @Column(name = "email")
    private String email;

    @Column(name = "city")
    private String city;

    @Column(name = "district")
    private String district;

    @Column(name = "username", unique = true)
    private String username;

    @NotBlank
    @Column(name = "password")
    private String password;

    @Column(name = "enabled", columnDefinition = "boolean default true")
    @Builder.Default
    private Boolean enabled = true;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (enabled == null) enabled = true;
    }
}

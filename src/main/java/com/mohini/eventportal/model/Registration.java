package com.mohini.eventportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Entity
@Table(name = "registration", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(Registration.RegistrationId.class)
public class Registration {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Event event;

    @Id
    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "transactionid", length = 100)
    private String transactionId;

    @Column(name = "group_id", length = 50)
    private String groupId;

// qrcode field removed because it does not exist in the registration table

    /** URL path to the payment screenshot file, e.g. /uploads/payment_success/{groupId}/payment_xxx.png */
    @Column(name = "payment_screenshot_path", length = 500)
    private String paymentScreenshotPath;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "registration_date")
    private java.time.LocalDateTime registrationDate;

    @Column(name = "reason", length = 500)
    private String reason;

    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) {
            registrationDate = java.time.LocalDateTime.now();
        }
    }

    public enum RegistrationStatus {
        PENDING, APPROVED, DENIED
    }

    // Composite primary key to satisfy Hibernate (since DB has no PK)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegistrationId implements Serializable {
        private Integer event; // Must match the type of Event's ID (which is Integer now)
        private String username;
    }
}

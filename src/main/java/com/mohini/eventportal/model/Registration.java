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
    private Event event;

    @Id
    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "transactionid", length = 100)
    private String transactionId;

    @Column(name = "group_id", length = 50)
    private String groupId;

    @Lob
    @Column(name = "qrcode")
    private byte[] qrcode;

    @Column(name = "status", length = 20)
    private String status;

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

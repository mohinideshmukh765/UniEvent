package com.mohini.eventportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "afterpost", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "coordinator", "college"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(columnDefinition = "TEXT", name = "event_description")
    private String caption; // mapped to event_description

    @Column(name = "feedback_form_link")
    private String feedbackFormLink; 

    // college_id doesn't exist in afterpost table, so mark it transient
    @Transient
    private College college;

    // createdAt doesn't exist in afterpost table, so mark it transient
    @Transient
    private LocalDateTime createdAt;
    
    // images doesn't exist in afterpost, we use 'photo' instead.
    @Transient
    private String images;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

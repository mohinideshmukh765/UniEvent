package com.mohini.eventportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "afterpost", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @Column(name = "event_id")
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Event event;

    @Column(columnDefinition = "TEXT", name = "photo")
    private String photo;

    @Column(columnDefinition = "TEXT", name = "event_description")
    private String caption;

    @Column(name = "feedback_form_link")
    private String feedbackFormLink;

    @Transient
    private College college;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "likes")
    @Builder.Default
    private Integer likes = 0;

    @Transient
    private String images;
}

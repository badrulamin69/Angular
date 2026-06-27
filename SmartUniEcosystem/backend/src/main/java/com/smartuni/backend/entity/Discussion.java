package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"discussions\"")
public class Discussion {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"content\"", length = 5000)
    private String content;
    @Column(name = "\"date\"", length = 5000)
    private String date;
}

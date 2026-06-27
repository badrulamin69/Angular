package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"course_content\"")
public class CourseContent {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"type\"", length = 5000)
    private String type;
    @Column(name = "\"duration\"", length = 5000)
    private String duration;
}

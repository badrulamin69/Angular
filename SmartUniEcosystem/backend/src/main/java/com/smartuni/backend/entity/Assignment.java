package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"assignments\"")
public class Assignment {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"due_date\"", length = 5000)
    private String dueDate;
    @Column(name = "\"total_points\"", length = 5000)
    private Integer totalPoints;
}

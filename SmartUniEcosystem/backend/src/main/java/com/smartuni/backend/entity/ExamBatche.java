package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"exam_batches\"")
public class ExamBatche {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"semester\"", length = 5000)
    private String semester;
    @Column(name = "\"department\"", length = 5000)
    private String department;
    @Column(name = "\"total_courses\"", length = 5000)
    private Integer totalCourses;
    @Column(name = "\"graded_courses\"", length = 5000)
    private Integer gradedCourses;
    @Column(name = "\"status\"", length = 5000)
    private String status;
}

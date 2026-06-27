package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"student_grades\"")
public class StudentGrade {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"student_id\"", length = 5000)
    private String studentId;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"grade\"", length = 5000)
    private String grade;
    @Column(name = "\"gp\"", length = 5000)
    private Double gp;
    @Column(name = "\"credits\"", length = 5000)
    private Integer credits;
}

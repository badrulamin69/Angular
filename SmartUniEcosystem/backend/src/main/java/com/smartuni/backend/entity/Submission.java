package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"submissions\"")
public class Submission {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"assignment_id\"", length = 5000)
    private String assignmentId;
    @Column(name = "\"student_id\"", length = 5000)
    private String studentId;
    @Column(name = "\"student_name\"", length = 5000)
    private String studentName;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"submission_date\"", length = 5000)
    private String submissionDate;
    @Column(name = "\"file_url\"", length = 5000)
    private String fileUrl;
    @Column(name = "\"grade\"", length = 5000)
    private String grade;
}

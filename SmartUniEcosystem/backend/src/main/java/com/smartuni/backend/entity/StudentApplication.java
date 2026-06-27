package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"student_applications\"")
public class StudentApplication {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"applicant_name\"", length = 5000)
    private String applicantName;
    @Column(name = "\"email\"", length = 5000)
    private String email;
    @Column(name = "\"program\"", length = 5000)
    private String program;
    @Column(name = "\"prior_g_p_a\"", length = 5000)
    private Double priorGPA;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"submission_date\"", length = 5000)
    private String submissionDate;
}

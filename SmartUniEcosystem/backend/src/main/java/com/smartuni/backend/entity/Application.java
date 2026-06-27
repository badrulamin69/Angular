package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"applications\"")
public class Application {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"applicant_id\"", length = 5000)
    private String applicantId;
    @Column(name = "\"program_id\"", length = 5000)
    private String programId;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"personal_info\"", length = 5000)
    private String personalInfo;
    @Column(name = "\"academic_info\"", length = 5000)
    private String academicInfo;
    @Column(name = "\"full_name\"", length = 5000)
    private String fullName;
    @Column(name = "\"dob\"", length = 5000)
    private String dob;
    @Column(name = "\"gender\"", length = 5000)
    private String gender;
    @Column(name = "\"previous_inst\"", length = 5000)
    private String previousInst;
    @Column(name = "\"ssc_gpa\"", length = 5000)
    private Double sscGpa;
    @Column(name = "\"hsc_gpa\"", length = 5000)
    private Double hscGpa;
    @Column(name = "\"applied_date\"", length = 5000)
    private String appliedDate;
    @Column(name = "\"faculty_id\"", length = 5000)
    private String facultyId;
    @Column(name = "\"department_id\"", length = 5000)
    private String departmentId;
}

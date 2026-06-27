package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"enrollments\"")
public class Enrollment {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"student_id\"", length = 5000)
    private String studentId;
    @Column(name = "\"course_id\"", length = 5000)
    private String courseId;
    @Column(name = "\"semester\"", length = 5000)
    private String semester;
    @Column(name = "\"progress\"", length = 5000)
    private Integer progress;
    @Column(name = "\"attendance\"", length = 5000)
    private Integer attendance;
    @Column(name = "\"completed_assignments\"", length = 5000)
    private Integer completedAssignments;
    @Column(name = "\"total_assignments\"", length = 5000)
    private Integer totalAssignments;
}

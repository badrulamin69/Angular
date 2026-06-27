package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"user_progress\"")
public class UserProgress {
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"last_accessed_course_id\"", length = 5000)
    private String lastAccessedCourseId;
    @Column(name = "\"last_accessed_module_id\"", length = 5000)
    private String lastAccessedModuleId;
    @Column(name = "\"total_hours_learned\"", length = 5000)
    private Double totalHoursLearned;
    @Column(name = "\"certificates_earned\"", length = 5000)
    private Integer certificatesEarned;
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
}

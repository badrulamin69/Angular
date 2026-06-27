package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"system_stats\"")
public class SystemStat {
    @Column(name = "\"total_universities\"", length = 5000)
    private Integer totalUniversities;
    @Column(name = "\"total_students\"", length = 5000)
    private Integer totalStudents;
    @Column(name = "\"total_revenue\"", length = 5000)
    private Integer totalRevenue;
    @Column(name = "\"active_users\"", length = 5000)
    private Integer activeUsers;
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
}

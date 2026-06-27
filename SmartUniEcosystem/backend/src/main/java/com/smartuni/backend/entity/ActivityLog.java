package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"activity_logs\"")
public class ActivityLog {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"time\"", length = 5000)
    private String time;
    @Column(name = "\"timestamp\"", length = 5000)
    private String timestamp;
    @Column(name = "\"type\"", length = 5000)
    private String type;
}

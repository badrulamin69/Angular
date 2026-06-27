package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"faculty_settings\"")
public class FacultySetting {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"theme\"", length = 5000)
    private String theme;
    @Column(name = "\"sidebar_collapsed\"", length = 5000)
    private Boolean sidebarCollapsed;
    @Column(name = "\"email_notifications\"", length = 5000)
    private Boolean emailNotifications;
    @Column(name = "\"assignment_notifications\"", length = 5000)
    private Boolean assignmentNotifications;
    @Column(name = "\"exam_notifications\"", length = 5000)
    private Boolean examNotifications;
    @Column(name = "\"message_notifications\"", length = 5000)
    private Boolean messageNotifications;
    @Column(name = "\"profile_visibility\"", length = 5000)
    private Boolean profileVisibility;
    @Column(name = "\"phone_visibility\"", length = 5000)
    private Boolean phoneVisibility;
    @Column(name = "\"last_updated\"", length = 5000)
    private String lastUpdated;
}

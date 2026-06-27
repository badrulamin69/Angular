package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"notifications\"")
public class Notification {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"message\"", length = 5000)
    private String message;
    @Column(name = "\"read\"", length = 5000)
    private Boolean read;
    @Column(name = "\"timestamp\"", length = 5000)
    private String timestamp;
}

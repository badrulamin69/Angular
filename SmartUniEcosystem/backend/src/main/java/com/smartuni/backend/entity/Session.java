package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"sessions\"")
public class Session {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"device\"", length = 5000)
    private String device;
    @Column(name = "\"ip_address\"", length = 5000)
    private String ipAddress;
    @Column(name = "\"location\"", length = 5000)
    private String location;
    @Column(name = "\"last_active\"", length = 5000)
    private String lastActive;
    @Column(name = "\"current\"", length = 5000)
    private Boolean current;
}

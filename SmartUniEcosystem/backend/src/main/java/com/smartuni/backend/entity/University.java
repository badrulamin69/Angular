package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"universities\"")
public class University {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"location\"", length = 5000)
    private String location;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"total_students\"", length = 5000)
    private Integer totalStudents;
}

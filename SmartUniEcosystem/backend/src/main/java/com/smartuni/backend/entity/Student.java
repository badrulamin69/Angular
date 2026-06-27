package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"students\"")
public class Student {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"email\"", length = 5000)
    private String email;
    @Column(name = "\"program\"", length = 5000)
    private String program;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"gpa\"", length = 5000)
    private Double gpa;
}

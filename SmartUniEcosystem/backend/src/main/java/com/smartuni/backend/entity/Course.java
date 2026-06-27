package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"courses\"")
public class Course {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"code\"", length = 5000)
    private String code;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"credits\"", length = 5000)
    private Integer credits;
    @Column(name = "\"department\"", length = 5000)
    private String department;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"enrolled\"", length = 5000)
    private Integer enrolled;
    @Column(name = "\"capacity\"", length = 5000)
    private Integer capacity;
    @Column(name = "\"instructor_id\"", length = 5000)
    private String instructorId;
}

package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"applicants\"")
public class Applicant {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"email\"", length = 5000)
    private String email;
    @Column(name = "\"phone\"", length = 5000)
    private String phone;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"applied_date\"", length = 5000)
    private String appliedDate;
}

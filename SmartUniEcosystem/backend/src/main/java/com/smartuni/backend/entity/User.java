package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"users\"")
public class User {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"email\"", length = 5000)
    private String email;
    @Column(name = "\"password\"", length = 5000)
    private String password;
    @Column(name = "\"role\"", length = 5000)
    private String role;
    @Column(name = "\"bio\"", length = 5000)
    private String bio;
    @Column(name = "\"university_id\"", length = 5000)
    private String universityId;
    @Column(name = "\"phone\"", length = 5000)
    private String phone;
    @Column(name = "\"designation\"", length = 5000)
    private String designation;
    @Column(name = "\"employee_id\"", length = 5000)
    private String employeeId;
    @Column(name = "\"profile_photo\"", length = 5000)
    private String profilePhoto;
}

package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"staff_profiles\"")
public class StaffProfile {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"designation\"", length = 5000)
    private String designation;
    @Column(name = "\"department\"", length = 5000)
    private String department;
    @Column(name = "\"joining_date\"", length = 5000)
    private String joiningDate;
    @Column(name = "\"salary\"", length = 5000)
    private Integer salary;
    @Column(name = "\"phone\"", length = 5000)
    private String phone;
    @Column(name = "\"address\"", length = 5000)
    private String address;
}

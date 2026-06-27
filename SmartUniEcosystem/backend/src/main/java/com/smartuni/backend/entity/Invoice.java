package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"invoices\"")
public class Invoice {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"student_id\"", length = 5000)
    private String studentId;
    @Column(name = "\"student_name\"", length = 5000)
    private String studentName;
    @Column(name = "\"credits\"", length = 5000)
    private Integer credits;
    @Column(name = "\"amount\"", length = 5000)
    private Integer amount;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"date\"", length = 5000)
    private String date;
}

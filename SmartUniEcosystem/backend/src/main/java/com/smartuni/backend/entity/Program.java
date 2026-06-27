package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"programs\"")
public class Program {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"department_id\"", length = 5000)
    private String departmentId;
    @Column(name = "\"credits\"", length = 5000)
    private Integer credits;
    @Column(name = "\"duration\"", length = 5000)
    private String duration;
}

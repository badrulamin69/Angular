package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"departments\"")
public class Department {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"faculty_id\"", length = 5000)
    private String facultyId;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"bn_name\"", length = 5000)
    private String bnName;
    @Column(name = "\"university_id\"", length = 5000)
    private String universityId;
}

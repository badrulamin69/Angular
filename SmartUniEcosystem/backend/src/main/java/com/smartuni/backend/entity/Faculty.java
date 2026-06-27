package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"faculties\"")
public class Faculty {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"bn_name\"", length = 5000)
    private String bnName;
    @Column(name = "\"university_id\"", length = 5000)
    private String universityId;
}

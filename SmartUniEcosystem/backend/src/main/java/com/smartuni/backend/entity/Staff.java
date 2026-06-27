package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"staff\"")
public class Staff {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"email\"", length = 5000)
    private String email;
    @Column(name = "\"role\"", length = 5000)
    private String role;
}

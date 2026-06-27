package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"buses\"")
public class Buse {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"route\"", length = 5000)
    private String route;
    @Column(name = "\"driver\"", length = 5000)
    private String driver;
    @Column(name = "\"capacity\"", length = 5000)
    private Integer capacity;
    @Column(name = "\"registered\"", length = 5000)
    private Integer registered;
}

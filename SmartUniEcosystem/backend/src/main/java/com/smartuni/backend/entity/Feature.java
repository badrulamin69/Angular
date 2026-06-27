package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"features\"")
public class Feature {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"description\"", length = 5000)
    private String description;
    @Column(name = "\"icon\"", length = 5000)
    private String icon;
    @Column(name = "\"color\"", length = 5000)
    private String color;
}

package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"hero_content\"")
public class HeroContent {
    @Column(name = "\"eyebrow\"", length = 5000)
    private String eyebrow;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"description\"", length = 5000)
    private String description;
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
}

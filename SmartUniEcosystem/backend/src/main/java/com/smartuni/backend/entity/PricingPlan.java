package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"pricing_plans\"")
public class PricingPlan {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"name\"", length = 5000)
    private String name;
    @Column(name = "\"description\"", length = 5000)
    private String description;
    @Column(name = "\"monthly\"", length = 5000)
    private String monthly;
    @Column(name = "\"annual\"", length = 5000)
    private String annual;
    @Column(name = "\"features\"", length = 5000)
    private String features;
    @Column(name = "\"button_text\"", length = 5000)
    private String buttonText;
    @Column(name = "\"popular\"", length = 5000)
    private Boolean popular;
}

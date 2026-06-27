package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"financial_rates\"")
public class FinancialRate {
    @Column(name = "\"undergrad_rate\"", length = 5000)
    private Integer undergradRate;
    @Column(name = "\"grad_rate\"", length = 5000)
    private Integer gradRate;
    @Column(name = "\"facility_fee\"", length = 5000)
    private Integer facilityFee;
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
}

package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"hostel_rooms\"")
public class HostelRoom {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"block\"", length = 5000)
    private String block;
    @Column(name = "\"type\"", length = 5000)
    private String type;
    @Column(name = "\"capacity\"", length = 5000)
    private Integer capacity;
    @Column(name = "\"occupied\"", length = 5000)
    private Integer occupied;
    @Column(name = "\"status\"", length = 5000)
    private String status;
}

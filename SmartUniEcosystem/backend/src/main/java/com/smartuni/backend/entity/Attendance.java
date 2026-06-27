package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"attendance\"")
public class Attendance {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"date\"", length = 5000)
    private String date;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"check_in\"", length = 5000)
    private String checkIn;
    @Column(name = "\"check_out\"", length = 5000)
    private String checkOut;
}

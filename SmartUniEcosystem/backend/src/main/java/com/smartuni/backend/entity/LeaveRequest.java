package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"leave_requests\"")
public class LeaveRequest {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"type\"", length = 5000)
    private String type;
    @Column(name = "\"start_date\"", length = 5000)
    private String startDate;
    @Column(name = "\"end_date\"", length = 5000)
    private String endDate;
    @Column(name = "\"reason\"", length = 5000)
    private String reason;
    @Column(name = "\"status\"", length = 5000)
    private String status;
}

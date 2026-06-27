package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"tasks\"")
public class Task {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"assigned_to\"", length = 5000)
    private String assignedTo;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"description\"", length = 5000)
    private String description;
    @Column(name = "\"priority\"", length = 5000)
    private String priority;
    @Column(name = "\"status\"", length = 5000)
    private String status;
    @Column(name = "\"due_date\"", length = 5000)
    private String dueDate;
}

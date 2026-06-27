package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"replies\"")
public class Reply {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"discussion_id\"", length = 5000)
    private String discussionId;
    @Column(name = "\"user_id\"", length = 5000)
    private String userId;
    @Column(name = "\"content\"", length = 5000)
    private String content;
    @Column(name = "\"date\"", length = 5000)
    private String date;
}

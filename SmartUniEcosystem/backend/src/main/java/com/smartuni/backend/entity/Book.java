package com.smartuni.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "\"books\"")
public class Book {
    @Id
    @Column(name = "\"id\"", length = 5000)
    private String id;
    @Column(name = "\"title\"", length = 5000)
    private String title;
    @Column(name = "\"author\"", length = 5000)
    private String author;
    @Column(name = "\"category\"", length = 5000)
    private String category;
    @Column(name = "\"stock\"", length = 5000)
    private Integer stock;
    @Column(name = "\"available\"", length = 5000)
    private Integer available;
}

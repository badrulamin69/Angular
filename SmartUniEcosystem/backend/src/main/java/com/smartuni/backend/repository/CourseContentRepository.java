package com.smartuni.backend.repository;

import com.smartuni.backend.entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, String> {
}

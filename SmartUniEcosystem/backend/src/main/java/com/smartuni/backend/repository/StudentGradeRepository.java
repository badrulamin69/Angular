package com.smartuni.backend.repository;

import com.smartuni.backend.entity.StudentGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGradeRepository extends JpaRepository<StudentGrade, String> {
}

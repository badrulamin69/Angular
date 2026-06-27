package com.smartuni.backend.repository;

import com.smartuni.backend.entity.ExamBatche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamBatcheRepository extends JpaRepository<ExamBatche, String> {
}

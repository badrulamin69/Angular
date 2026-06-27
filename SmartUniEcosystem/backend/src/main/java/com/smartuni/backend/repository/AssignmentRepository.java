package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, String> {
}

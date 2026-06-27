package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, String> {
}

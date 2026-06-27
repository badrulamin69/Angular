package com.smartuni.backend.repository;

import com.smartuni.backend.entity.StudentApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentApplicationRepository extends JpaRepository<StudentApplication, String> {
}

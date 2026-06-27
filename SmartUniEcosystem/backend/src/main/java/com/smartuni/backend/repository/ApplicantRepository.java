package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, String> {
}

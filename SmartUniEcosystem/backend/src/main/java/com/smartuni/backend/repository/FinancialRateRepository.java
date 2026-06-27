package com.smartuni.backend.repository;

import com.smartuni.backend.entity.FinancialRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialRateRepository extends JpaRepository<FinancialRate, String> {
}

package com.smartuni.backend.repository;

import com.smartuni.backend.entity.PricingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PricingPlanRepository extends JpaRepository<PricingPlan, String> {
}

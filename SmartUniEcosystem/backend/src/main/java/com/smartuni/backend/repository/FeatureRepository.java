package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, String> {
}

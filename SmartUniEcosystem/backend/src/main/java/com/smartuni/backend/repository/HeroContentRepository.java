package com.smartuni.backend.repository;

import com.smartuni.backend.entity.HeroContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HeroContentRepository extends JpaRepository<HeroContent, String> {
}

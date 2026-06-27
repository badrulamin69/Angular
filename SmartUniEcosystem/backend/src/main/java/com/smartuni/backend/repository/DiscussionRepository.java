package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, String> {
}

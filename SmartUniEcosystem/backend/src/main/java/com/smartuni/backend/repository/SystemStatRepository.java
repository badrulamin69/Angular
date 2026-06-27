package com.smartuni.backend.repository;

import com.smartuni.backend.entity.SystemStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemStatRepository extends JpaRepository<SystemStat, String> {
}

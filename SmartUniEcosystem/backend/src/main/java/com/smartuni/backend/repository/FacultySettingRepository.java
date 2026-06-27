package com.smartuni.backend.repository;

import com.smartuni.backend.entity.FacultySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultySettingRepository extends JpaRepository<FacultySetting, String> {
}

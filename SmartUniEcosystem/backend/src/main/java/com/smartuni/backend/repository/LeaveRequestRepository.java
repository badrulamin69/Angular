package com.smartuni.backend.repository;

import com.smartuni.backend.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, String> {
}

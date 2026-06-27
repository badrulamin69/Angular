package com.smartuni.backend.repository;

import com.smartuni.backend.entity.HostelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRoomRepository extends JpaRepository<HostelRoom, String> {
}

package com.smartuni.backend.repository;

import com.smartuni.backend.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, String> {
}

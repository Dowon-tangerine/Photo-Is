package org.ssafy.d103.chatbots.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.d103.chatbots.entity.ChatSession;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findBySessionId(String sessionId);
}

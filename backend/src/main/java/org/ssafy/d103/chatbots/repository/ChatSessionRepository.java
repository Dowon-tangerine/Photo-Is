package org.ssafy.d103.chatbots.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.d103.chatbots.entity.ChatSession;

import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findBySessionId(String sessionId);
}

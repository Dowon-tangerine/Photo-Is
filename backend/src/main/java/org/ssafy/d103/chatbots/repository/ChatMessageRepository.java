package org.ssafy.d103.chatbots.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.d103.chatbots.entity.ChatMessage;
import org.ssafy.d103.chatbots.entity.ChatSession;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySession(ChatSession session);
}

package org.ssafy.d103.chatbots.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;
    private String userMessage;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String botResponse;

    @Column(updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // Getters and Setters
}

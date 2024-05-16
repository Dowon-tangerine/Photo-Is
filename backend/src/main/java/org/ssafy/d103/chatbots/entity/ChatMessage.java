package org.ssafy.d103.chatbots.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private String role; // "user" or "assistant"

    @Column(updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    private ChatSession session;

}
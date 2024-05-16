package org.ssafy.d103.chatbots.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sessionId;
    private String userId;

    @OneToMany(mappedBy = "session")
    private List<ChatMessage> chatMessages;

    @Column(updatable = false, insertable = false)
    private LocalDateTime createdAt;
}

package org.ssafy.d103.chatbots.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
public class ChatRequestDto {
    private String question;
    private String sessionId;

    public ChatRequestDto(String question, String sessionId) {
        this.question = question;
        this.sessionId = sessionId;
    }

    // Getters and setters
}
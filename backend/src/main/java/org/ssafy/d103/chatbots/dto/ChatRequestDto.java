package org.ssafy.d103.chatbots.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
public class ChatRequestDto {
    private String message;
    private String userId;
    private String sessionId;

    public ChatRequestDto(String message, String userId, String sessionId) {
        this.message = message;
        this.userId = userId;
        this.sessionId = sessionId;
    }

}
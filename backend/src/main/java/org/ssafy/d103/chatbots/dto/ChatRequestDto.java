package org.ssafy.d103.chatbots.dto;

import lombok.Data;

@Data
public class ChatRequestDto {
    private String message;
    private String memberId;
    private String sessionId;

    public ChatRequestDto(String message, String memberId, String sessionId) {
        this.message = message;
        this.memberId = memberId;
        this.sessionId = sessionId;
    }

}
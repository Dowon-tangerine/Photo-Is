package org.ssafy.d103.chatbots.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatSessionRequest {
    private String sessionId;
    private String userId;
    private List<ChatMessageDto> messages;
}

package org.ssafy.d103.chatbots.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChatSessionRequestDto {
    private String question;
    private List<ChatMessageDto> messages;
}

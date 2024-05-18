package org.ssafy.d103.chatbots.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatSessionResponseDto {
    private long id;
    private String memberId;
    private String lastMessage;
}

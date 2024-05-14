package org.ssafy.d103.chatbots.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.ssafy.d103.chatbots.dto.ChatRequestDto;
import org.ssafy.d103.chatbots.dto.ChatResponseDto;
import org.ssafy.d103.chatbots.dto.ImageRequestDto;
import org.ssafy.d103.chatbots.entity.ChatSession;
import org.ssafy.d103.chatbots.repository.ChatSessionRepository;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ChatbotService {

    private final ChatSessionRepository chatSessionRepository;

    private final WebClient webClient;

    public ChatbotService(WebClient.Builder webClientBuilder, ChatSessionRepository chatSessionRepository) {
        this.webClient = webClientBuilder.baseUrl("https://k10d103.p.ssafy.io").build();
        this.chatSessionRepository = chatSessionRepository;
    }

    public Mono<String> getChatbotResponse(String sessionId, String question) {
        return this.webClient.post()
                .uri("/camera_chat")
                .bodyValue(new ChatRequestDto(question, sessionId))
                .retrieve()
                .bodyToMono(ChatResponseDto.class)
                .flatMap(response -> {
                    saveChatSession(sessionId, question, response.getAnswer());
                    return Mono.just(response.getAnswer());
                });
    }

    public Mono<String> describeImage(String imageUrl) {
        return this.webClient.post()
                .uri("/describe-image")
                .bodyValue(new ImageRequestDto(imageUrl))
                .retrieve()
                .bodyToMono(String.class);
    }

    private void saveChatSession(String sessionId, String userMessage, String botResponse) {
        ChatSession chatSession = new ChatSession();
        chatSession.setSessionId(sessionId);
        chatSession.setUserMessage(userMessage);
        chatSession.setBotResponse(botResponse);
        chatSessionRepository.save(chatSession);
    }

    public List<ChatSession> getChatSessions(String sessionId) {
        return chatSessionRepository.findBySessionId(sessionId);
    }
}

package org.ssafy.d103.chatbots.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.ssafy.d103.chatbots.dto.*;
import org.ssafy.d103.chatbots.entity.ChatMessage;
import org.ssafy.d103.chatbots.entity.ChatSession;
import org.ssafy.d103.chatbots.repository.ChatMessageRepository;
import org.ssafy.d103.chatbots.repository.ChatSessionRepository;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final WebClient.Builder webClientBuilder;
    private WebClient webClient;

    @PostConstruct
    private void initWebClient() {
        this.webClient = webClientBuilder.baseUrl("http://localhost:9001").build();
    }

    public Mono<String> getChatbotResponse(String sessionId, String userId, String question) {
        Optional<ChatSession> sessionOptional = chatSessionRepository.findBySessionId(sessionId);
        ChatSession session;

        if (sessionOptional.isEmpty()) {
            session = ChatSession.builder().sessionId(sessionId).userId(userId).build();
            chatSessionRepository.save(session);
        } else {
            session = sessionOptional.get();  // Optional에서 세션 추출
        }

        ChatMessage userMessage = ChatMessage.builder()
                .session(session)
                .message(question)
                .role("user")
                .build();
        chatMessageRepository.save(userMessage);

        List<ChatMessage> chatHistory = chatMessageRepository.findBySession(session);

        List<ChatMessageDto> messageDTOs = chatHistory.stream()
                .map(message -> new ChatMessageDto(message.getRole(), message.getMessage()))
                .collect(Collectors.toList());

        ChatSessionRequestDto chatSessionRequestDto = new ChatSessionRequestDto(question, messageDTOs);

        return webClient.post()
                .uri("/api/py/chat")
                .bodyValue(chatSessionRequestDto)
                .retrieve()
                .bodyToMono(ChatResponseDto.class)
                .map(response -> {
                    ChatMessage assistantMessage = ChatMessage.builder()
                            .session(session)
                            .message(response.getAnswer())
                            .role("assistant")
                            .build();
                    chatMessageRepository.save(assistantMessage);

                    return response.getAnswer();
                });
    }

    public Mono<String> describeImage(String imageUrl) {
        return this.webClient.post()
                .uri("/api/py/describe-image")
                .bodyValue(new ImageRequestDto(imageUrl))
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<TagResponseDto> generateTags(TagRequestDto request) {
        return webClient.post()
                .uri("/api/py/generate-tags")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(TagResponseDto.class);
    }
}

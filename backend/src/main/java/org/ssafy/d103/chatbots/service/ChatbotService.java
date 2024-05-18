package org.ssafy.d103.chatbots.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.ssafy.d103.chatbots.dto.*;
import org.ssafy.d103.chatbots.entity.ChatMessage;
import org.ssafy.d103.chatbots.entity.ChatSession;
import org.ssafy.d103.chatbots.repository.ChatMessageRepository;
import org.ssafy.d103.chatbots.repository.ChatSessionRepository;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
        //this.webClient = webClientBuilder.baseUrl("http://localhost:9001").build();
        this.webClient = webClientBuilder.baseUrl("https://k10d103.p.ssafy.io").build();
    }

    public Mono<ChatResponseDto> getChatbotResponse(Long sessionId, String memberId, String question) {
        ChatSession session;

        if (sessionId == null) {
            session = ChatSession.builder()
                    .memberId(memberId)
                    .build();
            chatSessionRepository.save(session);
            sessionId = session.getId(); // 생성된 세션의 ID를 가져옴
        } else {
            Optional<ChatSession> sessionOptional = chatSessionRepository.findById(sessionId);

            if (sessionOptional.isEmpty()) {
                return Mono.error(new RuntimeException("Session not found"));
            }

            session = sessionOptional.get();  // Optional에서 세션 추출
        }

        final ChatSession finalSession = session;
        final Long finalSessionId = sessionId;

        ChatMessage userMessage = ChatMessage.builder()
                .session(session)
                .message(question)
                .role("user")
                .build();

        // 세션 마지막 질문 업데이트 및 메세지 저장
        session.setLastMessage(question);
        session.setUpdatedAt(LocalDateTime.now());
        chatMessageRepository.save(userMessage);

        List<ChatMessage> chatHistory = chatMessageRepository.findBySession(session);

        List<ChatMessageDto> messageDTOs = chatHistory.stream()
                .map(message -> new ChatMessageDto(message.getRole(), message.getMessage()))
                .filter(dto -> dto.getMessage() != null && !dto.getMessage().isEmpty()) // null 또는 빈 메시지 필터링
                .collect(Collectors.toList());

        ChatSessionRequestDto chatSessionRequestDto = new ChatSessionRequestDto(question, messageDTOs);

        return webClient.post()
                .uri("/api/py/chat")
                .bodyValue(chatSessionRequestDto)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                            return Mono.error(new RuntimeException("Error response from server: " + errorBody));
                        })
                )
                .bodyToMono(ChatResponseDto.class)
                .flatMap(response -> {
                    if (response == null || response.getAnswer() == null) {
                        return Mono.error(new NullPointerException("Received null response from server"));
                    }

                    ChatMessage assistantMessage = ChatMessage.builder()
                            .session(finalSession)
                            .message(response.getAnswer())
                            .role("assistant")
                            .build();
                    chatMessageRepository.save(assistantMessage);

                    // sessionId를 설정한 ChatResponseDto 반환
                    response.setSessionId(finalSessionId);
                    return Mono.just(response);
                })
                .onErrorResume(WebClientResponseException.class, e -> {
                    return Mono.error(new RuntimeException("Failed to call external API", e));
                });
    }

    public List<ChatSessionResponseDto> getSessionsByMemberId(String memberId) {
        List<ChatSession> sessions = chatSessionRepository.findByMemberId(memberId);
        return sessions.stream()
                .map(session -> new ChatSessionResponseDto(session.getId(),session.getMemberId(), session.getLastMessage()))
                .collect(Collectors.toList());
    }


    public List<ChatMessageDto> getMessagesBySessionId(long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));
        List<ChatMessage> messages = chatMessageRepository.findBySession(session);
        return messages.stream()
                .map(message -> new ChatMessageDto(message.getRole(), message.getMessage()))
                .collect(Collectors.toList());
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

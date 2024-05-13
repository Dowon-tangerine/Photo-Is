package org.ssafy.d103.chatbots.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.ssafy.d103.chatbots.dto.ChatRequestDto;
import org.ssafy.d103.chatbots.dto.ChatResponseDto;
import org.springframework.web.reactive.function.client.WebClient;
import org.ssafy.d103.chatbots.dto.ImageRequestDto;
import reactor.core.publisher.Mono;

@Service
public class ChatbotService {
    private final WebClient webClient;

    public ChatbotService(WebClient webClient) {
        this.webClient = webClient;
    }


    public Mono<String> getChatbotResponse(String question) {
        return this.webClient.post()
                .uri("/camera_chat")
                .bodyValue(new ChatRequestDto(question))
                .retrieve()
                .bodyToMono(ChatResponseDto.class)
                .map(ChatResponseDto::getAnswer);
    }

    public Mono<String> analyzeImage(String imageUrl) {
        return this.webClient.post()
                .uri("/describe-image")
                .bodyValue(new ImageRequestDto(imageUrl))
                .retrieve()
                .bodyToMono(String.class);
    }
}

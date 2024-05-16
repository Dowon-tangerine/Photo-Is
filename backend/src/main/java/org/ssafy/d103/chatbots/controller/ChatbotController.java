package org.ssafy.d103.chatbots.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103.chatbots.dto.ChatRequestDto;
import org.ssafy.d103.chatbots.dto.ImageRequestDto;
import org.ssafy.d103.chatbots.dto.TagRequestDto;
import org.ssafy.d103.chatbots.dto.TagResponseDto;
import org.ssafy.d103.chatbots.service.ChatbotService;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public Mono<ResponseEntity<Map<String, String>>> chat(@RequestBody ChatRequestDto request) {
        String sessionId = request.getSessionId() == null || request.getSessionId().isEmpty()
                ? UUID.randomUUID().toString()
                : request.getSessionId();

        return chatbotService.getChatbotResponse(sessionId, request.getQuestion())
                .map(response -> {
                    Map<String, String> responseBody = new HashMap<>();
                    responseBody.put("answer", response);
                    responseBody.put("session_id", sessionId);
                    return ResponseEntity.ok(responseBody);
                });
    }

    @PostMapping("/analyze")
    public Mono<ResponseEntity<String>> analyzeImage(@RequestBody ImageRequestDto request) {
        return chatbotService.describeImage(request.getImageUrl())
                .map(description -> ResponseEntity.ok(description))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate-tags")
    public Mono<ResponseEntity<TagResponseDto>> generateTags(@RequestBody TagRequestDto request) {
        return chatbotService.generateTags(request)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

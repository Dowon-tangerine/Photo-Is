package org.ssafy.d103.chatbots.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "chatbots", description = "챗봇 관련 API")
@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Operation(summary = "카메라 전문 챗봇 질문",
            description = "챗봇 질문에 대한 답을 받습니다."
    )
    @PostMapping("/chat")
    public Mono<String> askQuestion(@RequestParam String sessionId, @RequestParam String userId, @RequestParam String question) {
        return chatbotService.getChatbotResponse(sessionId, userId, question);
    }

    @Operation(summary = "사진 분석",
            description = "사진의 여러 요소를 평가해 조언을 해줍니다."
    )
    @PostMapping("/analyze")
    public Mono<ResponseEntity<String>> analyzeImage(@RequestBody ImageRequestDto request) {
        return chatbotService.describeImage(request.getImageUrl())
                .map(description -> ResponseEntity.ok(description))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @Operation(summary = "자동 태그 생성",
            description = "사진에 알맞는 태그를 자동으로 생성 해줍니다."
    )
    @PostMapping("/generate-tags")
    public Mono<ResponseEntity<TagResponseDto>> generateTags(@RequestBody TagRequestDto request) {
        return chatbotService.generateTags(request)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

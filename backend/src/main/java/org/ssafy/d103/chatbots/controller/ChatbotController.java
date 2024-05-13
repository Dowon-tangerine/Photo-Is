package org.ssafy.d103.chatbots.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.d103.chatbots.dto.ChatRequestDto;
import org.ssafy.d103.chatbots.dto.ImageRequestDto;
import org.ssafy.d103.chatbots.service.ChatbotService;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chatbots")
public class ChatbotController {
    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/chat")
    public Mono<String> chat(@RequestBody ChatRequestDto request) {
        return chatbotService.getChatbotResponse(request.getQuestion());
    }

    @PostMapping("/analyze")
    public Mono<ResponseEntity<String>> analyzeImage(@RequestBody ImageRequestDto request) {
        return chatbotService.analyzeImage(request.getImage_url())
                .map(description -> ResponseEntity.ok(description))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

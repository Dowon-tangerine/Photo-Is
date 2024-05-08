package org.ssafy.d103.communities.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.communities.dto.question.request.PostUploadQuestionRequest;
import org.ssafy.d103.communities.dto.question.response.PostUploadQuestionResponse;
import org.ssafy.d103.communities.service.QuestionService;

@Tag(name = "Communities - Question", description = "Communities Question API")
@Slf4j
@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/upload")
    public ApiResponseDto<PostUploadQuestionResponse> postUploadQuestion(Authentication authentication, @RequestBody PostUploadQuestionRequest postUploadQuestionRequest) {
        return ResponseUtils.ok(questionService.uploadQuestion(authentication, postUploadQuestionRequest), MsgType.QUESTION_UPLOAD_SUCCESSFULLY);
    }

}
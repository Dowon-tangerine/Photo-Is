package org.ssafy.d103.communities.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.communities.dto.question.request.PostUploadQuestionRequest;
import org.ssafy.d103.communities.dto.question.request.PutModifyQuestionRequest;
import org.ssafy.d103.communities.dto.question.response.*;
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

    @GetMapping
    public ApiResponseDto<GetQuestionListResponse> getQuestionList(@RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(questionService.getQuestionList(page, size), MsgType.QUESTION_LIST_GET_SUCCESSFULLY);
    }

    @GetMapping("/{question-id}")
    public ApiResponseDto<GetQuestionDetailResponse> getQuestionDetail(@PathVariable("question-id") Long questionId) {
        return ResponseUtils.ok(questionService.getQuestionDetail(questionId), MsgType.QUESTION_DETAIL_GET_SUCCESSFULLY);
    }

    @PutMapping("/{question-id}")
    public ApiResponseDto<PutModifyQuestionResponse> putModifyQuestion(Authentication authentication, @PathVariable("question-id") Long questionId, @RequestBody PutModifyQuestionRequest putModifyQuestionRequest) {
        return ResponseUtils.ok(questionService.putModifyQuestion(authentication, questionId, putModifyQuestionRequest), MsgType.QUESTION_MODIFY_SUCCESSFULLY);
    }

    @DeleteMapping("/{question-id}")
    public ApiResponseDto<DeleteQuestionResponse> deleteQuestion(Authentication authentication, @PathVariable("question-id") Long questionId) {
        return ResponseUtils.ok(questionService.removeQuestion(authentication, questionId), MsgType.QUESTION_DELETE_SUCCESSFULLY);
    }

}
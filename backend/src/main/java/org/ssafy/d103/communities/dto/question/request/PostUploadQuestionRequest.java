package org.ssafy.d103.communities.dto.question.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PostUploadQuestionRequest {

    private Long photoId;

    @NotBlank(message = "질문의 카테고리를 입력해주세요.")
    private String category;

    @NotBlank(message = "질문의 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "질문의 내용을 입력해주세요.")
    private String content;

}
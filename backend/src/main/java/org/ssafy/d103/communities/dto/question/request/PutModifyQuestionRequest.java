package org.ssafy.d103.communities.dto.question.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PutModifyQuestionRequest {

    @NotBlank(message = "수정할 제목을 입력해주세요.")
    private String title;

    @NotBlank(message = "수정할 내용을 입력해주세요.")
    private String content;

}
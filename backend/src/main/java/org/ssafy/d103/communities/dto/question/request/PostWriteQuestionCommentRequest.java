package org.ssafy.d103.communities.dto.question.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PostWriteQuestionCommentRequest {

    @NotBlank(message = "작성할 댓글을 입력해주세요.")
    private String comment;

}
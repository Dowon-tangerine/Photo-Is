package org.ssafy.d103.communities.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class DeletePhotoCommentRequest {

    @NotNull(message = "삭제할 댓글의 ID를 입력해주세요.")
    private Long commentId;

}
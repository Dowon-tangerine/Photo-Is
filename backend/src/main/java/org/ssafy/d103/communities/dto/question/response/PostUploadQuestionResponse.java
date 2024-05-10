package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PostUploadQuestionResponse {

    private boolean isSuccess;

    @Builder
    private PostUploadQuestionResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public static PostUploadQuestionResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }

}
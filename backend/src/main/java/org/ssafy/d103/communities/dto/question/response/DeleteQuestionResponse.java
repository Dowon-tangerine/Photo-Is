package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class DeleteQuestionResponse {

    private boolean isSuccess;

    @Builder
    private DeleteQuestionResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public static DeleteQuestionResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }

}
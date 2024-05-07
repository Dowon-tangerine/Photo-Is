package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class DeleteRemovePhotoResponse {

    private boolean isSuccess;

    @Builder
    private DeleteRemovePhotoResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    static public DeleteRemovePhotoResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }

}
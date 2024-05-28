package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class DeletePhotoResponse {

    private boolean isSuccess;

    @Builder
    private DeletePhotoResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    static public DeletePhotoResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }

}
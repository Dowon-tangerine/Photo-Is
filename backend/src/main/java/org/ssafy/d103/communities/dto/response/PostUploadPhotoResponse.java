package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PostUploadPhotoResponse {

    private boolean isSuccess;

    @Builder
    private PostUploadPhotoResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    static public PostUploadPhotoResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }
}
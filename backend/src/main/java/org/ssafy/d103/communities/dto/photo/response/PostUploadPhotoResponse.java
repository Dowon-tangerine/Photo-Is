package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PostUploadPhotoResponse {

    private Long photoId;
    private boolean isSuccess;

    @Builder
    private PostUploadPhotoResponse(Long photoId, boolean isSuccess) {
        this.photoId = photoId;
        this.isSuccess = isSuccess;
    }

    static public PostUploadPhotoResponse of(Long photoId, boolean isSuccess) {
        return builder()
                .photoId(photoId)
                .isSuccess(isSuccess)
                .build();
    }

}
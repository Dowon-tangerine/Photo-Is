package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PutSaveStudioMetadataResponse {

    private boolean isSuccess;

    @Builder
    private PutSaveStudioMetadataResponse(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    static public PutSaveStudioMetadataResponse of(boolean isSuccess) {
        return builder()
                .isSuccess(isSuccess)
                .build();
    }

}
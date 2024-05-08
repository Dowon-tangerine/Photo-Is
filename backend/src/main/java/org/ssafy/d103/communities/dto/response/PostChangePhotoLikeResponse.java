package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PostChangePhotoLikeResponse {

    private boolean isLiked;
    private Integer likeCnt;

    @Builder
    private PostChangePhotoLikeResponse(boolean isLiked, Integer likeCnt) {
        this.isLiked = isLiked;
        this.likeCnt = likeCnt;
    }

    public static PostChangePhotoLikeResponse of(boolean isLiked, Integer likeCnt) {
        return builder()
                .isLiked(isLiked)
                .likeCnt(likeCnt)
                .build();
    }

}
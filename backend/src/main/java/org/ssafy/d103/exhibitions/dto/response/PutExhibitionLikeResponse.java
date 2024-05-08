package org.ssafy.d103.exhibitions.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

@Getter
@Setter
public class PutExhibitionLikeResponse {

    private boolean isLiked;
    private int likeCnt;

    @Builder
    private PutExhibitionLikeResponse(boolean isLiked, int likeCnt) {
        this.isLiked = isLiked;
        this.likeCnt = likeCnt;
    }

    public static PutExhibitionLikeResponse of(boolean isLiked, Exhibitions exhibition) {
        return builder()
                .isLiked(isLiked)
                .likeCnt(exhibition.getLikeCnt())
                .build();
    }
}

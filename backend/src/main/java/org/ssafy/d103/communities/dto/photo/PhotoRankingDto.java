package org.ssafy.d103.communities.dto.photo;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PhotoRankingDto {

    private Long photoId;
    private Integer ranking;
    private String thumbnailUrl;
    private String title;
    private Integer likeCnt;
    private Boolean isLiked;

    @Builder
    private PhotoRankingDto(Long photoId, Integer ranking, String thumbnailUrl, String title, Integer likeCnt, Boolean isLiked) {
        this.photoId = photoId;
        this.ranking = ranking;
        this.thumbnailUrl = thumbnailUrl;
        this.title = title;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
    }

    public static PhotoRankingDto of(Long photoId, Integer ranking, String thumbnailUrl, String title, Integer likeCnt, Boolean isLiked) {
        return builder()
                .photoId(photoId)
                .ranking(ranking)
                .thumbnailUrl(thumbnailUrl)
                .title(title)
                .likeCnt(likeCnt)
                .isLiked(isLiked)
                .build();
    }

}
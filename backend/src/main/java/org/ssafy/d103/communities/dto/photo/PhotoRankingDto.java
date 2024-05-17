package org.ssafy.d103.communities.dto.photo;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PhotoRankingDto {

    private Long photoId;
    private Integer ranking;
    private String thumbnailUrl;
    private String profileUrl;
    private String nickname;
    private Integer likeCnt;
    private Boolean isLiked;

    @Builder
    private PhotoRankingDto(Long photoId, Integer ranking, String thumbnailUrl, String profileUrl, String nickname, Integer likeCnt, Boolean isLiked) {
        this.photoId = photoId;
        this.ranking = ranking;
        this.thumbnailUrl = thumbnailUrl;
        this.profileUrl = profileUrl;
        this.nickname = nickname;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
    }

    public static PhotoRankingDto of(Long photoId, Integer ranking, String thumbnailUrl, String profileUrl, String nickname, Integer likeCnt, Boolean isLiked) {
        return builder()
                .photoId(photoId)
                .ranking(ranking)
                .thumbnailUrl(thumbnailUrl)
                .profileUrl(profileUrl)
                .nickname(nickname)
                .likeCnt(likeCnt)
                .isLiked(isLiked)
                .build();
    }

}
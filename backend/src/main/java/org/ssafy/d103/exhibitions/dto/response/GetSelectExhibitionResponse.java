package org.ssafy.d103.exhibitions.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.time.LocalDateTime;

@Getter
@Setter
public class GetSelectExhibitionResponse {

    private Long exhibitionId;
    private String title;
    private Long memberId;
    private String nickname;
    private String posterUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int likeCnt;
    private boolean isLiked;
    private String profileUrl;

    @Builder
    private GetSelectExhibitionResponse(Long exhibitionId, String title, Long memberId, String nickname, String posterUrl, LocalDateTime startDate, LocalDateTime endDate, int likeCnt, boolean isLiked, String profileUrl) {
        this.exhibitionId = exhibitionId;
        this.title = title;
        this.memberId = memberId;
        this.nickname = nickname;
        this.posterUrl = posterUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
        this.profileUrl = profileUrl;
    }

    public static GetSelectExhibitionResponse from(Exhibitions exhibition, boolean isLiked) {
        return builder()
                .exhibitionId(exhibition.getId())
                .title(exhibition.getTitle())
                .memberId(exhibition.getMemberId().getId())
                .nickname(exhibition.getMemberId().getNickname())
                .posterUrl(exhibition.getPosterUrl())
                .startDate(exhibition.getCreatedAt())
                .endDate(exhibition.getEndDate())
                .likeCnt(exhibition.getLikeCnt())
                .isLiked(isLiked)
                .profileUrl(exhibition.getMemberId().getProfileUrl())
                .build();
    }
}

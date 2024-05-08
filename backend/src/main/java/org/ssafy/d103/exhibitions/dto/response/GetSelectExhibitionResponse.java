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

    @Builder
    private GetSelectExhibitionResponse(Long exhibitionId, String title, Long memberId, String nickname, String posterUrl, LocalDateTime startDate, LocalDateTime endDate, int likeCnt) {
        this.exhibitionId = exhibitionId;
        this.title = title;
        this.memberId = memberId;
        this.nickname = nickname;
        this.posterUrl = posterUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.likeCnt = likeCnt;
    }

    public static GetSelectExhibitionResponse from(Exhibitions exhibition) {
        return builder()
                .exhibitionId(exhibition.getId())
                .title(exhibition.getTitle())
                .memberId(exhibition.getMemberId().getId())
                .nickname(exhibition.getMemberId().getNickname())
                .posterUrl(exhibition.getPosterUrl())
                .startDate(exhibition.getCreatedAt())
                .endDate(exhibition.getEndDate())
                .likeCnt(exhibition.getLikeCnt())
                .build();
    }
}

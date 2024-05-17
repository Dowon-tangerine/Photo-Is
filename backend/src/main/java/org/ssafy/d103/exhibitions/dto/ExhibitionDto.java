package org.ssafy.d103.exhibitions.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionDto {
//프로필 사진, 좋아요 여부,
    private Long exhibitionId;
    private Long memberId;
    private String nickname;
    private String title;
    private String posterUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int likeCnt;

    @Builder
    private ExhibitionDto(Long exhibitionId, Long memberId, String nickname, String title, String posterUrl, LocalDateTime startDate, LocalDateTime endDate, int likeCnt) {
        this.exhibitionId = exhibitionId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.title = title;
        this.posterUrl = posterUrl;
        this.startDate = startDate;
        this.endDate = endDate;
        this.likeCnt = likeCnt;
    }

    public static ExhibitionDto from(Exhibitions exhibition) {
        return builder()
                .exhibitionId(exhibition.getId())
                .memberId(exhibition.getMemberId().getId())
                .nickname(exhibition.getMemberId().getNickname())
                .title(exhibition.getTitle())
                .posterUrl(exhibition.getPosterUrl())
                .startDate(exhibition.getCreatedAt())
                .endDate(exhibition.getEndDate())
                .likeCnt(exhibition.getLikeCnt())
                .build();
    }
}

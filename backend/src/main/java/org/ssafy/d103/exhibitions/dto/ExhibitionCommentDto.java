package org.ssafy.d103.exhibitions.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.ExhibitionComment;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionCommentDto {

    private Long exhibitionCommentId;
    private Long memberId;
    private String nickname;
    private String comment;
    private LocalDateTime createdAt;

    @Builder
    private ExhibitionCommentDto(Long exhibitionCommentId, Long memberId, String nickname, String comment, LocalDateTime createdAt) {
        this.exhibitionCommentId = exhibitionCommentId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static ExhibitionCommentDto from(ExhibitionComment exhibitionComment) {
        return builder()
                .exhibitionCommentId(exhibitionComment.getId())
                .memberId(exhibitionComment.getMemberId().getId())
                .nickname(exhibitionComment.getMemberId().getNickname())
                .comment(exhibitionComment.getComment())
                .createdAt(exhibitionComment.getCreatedAt())
                .build();
    }
}

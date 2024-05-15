package org.ssafy.d103.communities.dto.photo;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.time.LocalDateTime;

@Getter
public class PhotoCommentDto {

    private Long commentId;
    private Long memberId;
    private String nickname;
    private String profileUrl;
    private String comment;
    private LocalDateTime createdAt;

    @Builder
    private PhotoCommentDto(Long commentId, Long memberId, String nickname, String profileUrl, String comment, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static PhotoCommentDto from(PhotoComment photoComment) {
        return builder()
                .commentId(photoComment.getId())
                .memberId(photoComment.getMember().getId())
                .nickname(photoComment.getMember().getNickname())
                .profileUrl(photoComment.getMember().getProfileUrl())
                .comment(photoComment.getComment())
                .createdAt(photoComment.getCreatedAt())
                .build();
    }

}
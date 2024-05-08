package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.time.LocalDateTime;

@Getter
public class PhotoCommentResponse {

    private Long commentId;
    private String nickname;
    private String profileUrl;
    private String comment;
    private LocalDateTime createdAt;

    @Builder
    private PhotoCommentResponse(Long commentId, String nickname, String profileUrl, String comment, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static PhotoCommentResponse from(PhotoComment photoComment) {
        return builder()
                .commentId(photoComment.getId())
                .nickname(photoComment.getMember().getNickname())
                .profileUrl(photoComment.getMember().getProfileUrl())
                .comment(photoComment.getComment())
                .createdAt(photoComment.getCreatedAt())
                .build();
    }

}
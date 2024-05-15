package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.question.QuestionComment;

import java.time.LocalDateTime;

@Getter
public class QuestionCommentDto {

    private Long commentId;
    private Long memberId;
    private String nickname;
    private String profileUrl;
    private String comment;
    private LocalDateTime createdAt;

    @Builder
    private QuestionCommentDto(Long commentId, Long memberId, String nickname, String profileUrl, String comment, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static QuestionCommentDto from(QuestionComment questionComment) {
        return builder()
                .commentId(questionComment.getId())
                .memberId(questionComment.getMember().getId())
                .nickname(questionComment.getMember().getNickname())
                .profileUrl(questionComment.getMember().getProfileUrl())
                .comment(questionComment.getComment())
                .createdAt(questionComment.getCreatedAt())
                .build();
    }

}
package org.ssafy.d103.communities.dto.question;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class QuestionDto {

    private Long questionId;
    private Long memberId;
    private String nickname;
    private String category;
    private String title;
    private boolean hasPhoto;
    private int commentCnt;
    private int viewCnt;
    private LocalDateTime createdAt;

    @Builder
    private QuestionDto(Long questionId, Long memberId, String nickname, String category, String title, boolean hasPhoto, int commentCnt, int viewCnt, LocalDateTime createdAt) {
        this.questionId = questionId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.category = category;
        this.title = title;
        this.hasPhoto = hasPhoto;
        this.commentCnt = commentCnt;
        this.viewCnt = viewCnt;
        this.createdAt = createdAt;
    }


    public static QuestionDto of(Long questionId, Long memberId, String nickname, String category, String title, boolean hasPhoto, int commentCnt, int viewCnt, LocalDateTime createdAt) {
        return builder()
                .questionId(questionId)
                .memberId(memberId)
                .nickname(nickname)
                .category(category)
                .title(title)
                .hasPhoto(hasPhoto)
                .commentCnt(commentCnt)
                .viewCnt(viewCnt)
                .createdAt(createdAt)
                .build();
    }

}
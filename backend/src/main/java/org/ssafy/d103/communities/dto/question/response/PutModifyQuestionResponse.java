package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;
import org.ssafy.d103.communities.entity.question.Question;

import java.time.LocalDateTime;

@Getter
public class PutModifyQuestionResponse {

    private Long questionId;
    private Long memberId;
    private String title;
    private String content;
    private String photoUrl;
    private Integer viewCnt;
    private LocalDateTime createdAt;
    private PhotoMetadata metadata;

    @Builder
    private PutModifyQuestionResponse(Long questionId, Long memberId, String title, String content, String photoUrl, Integer viewCnt, LocalDateTime createdAt, PhotoMetadata metadata) {
        this.questionId = questionId;
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.photoUrl = photoUrl;
        this.viewCnt = viewCnt;
        this.createdAt = createdAt;
        this.metadata = metadata;
    }

    public static PutModifyQuestionResponse from(Question question) {
        return builder()
                .questionId(question.getId())
                .memberId(question.getMember().getId())
                .title(question.getTitle())
                .content(question.getContent())
                .photoUrl(question.getPhoto().getImageUrl())
                .viewCnt(question.getQuestionDetail().getViewCnt())
                .createdAt(question.getCreatedAt())
                .metadata(PhotoMetadata.from(question.getPhoto().getPhotoMetadata()))
                .build();
    }

}
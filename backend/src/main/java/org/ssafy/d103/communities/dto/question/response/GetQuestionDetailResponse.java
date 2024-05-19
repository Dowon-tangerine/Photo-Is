package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionDetail;

import java.time.LocalDateTime;

@Getter
public class GetQuestionDetailResponse {

    private Long questionId;
    private Long memberId;
    private String title;
    private String content;
    private String photoUrl;
    private Integer viewCnt;
    private LocalDateTime createdAt;
    private PhotoMetadata metadata;

    @Builder
    private GetQuestionDetailResponse(Long questionId, Long memberId, String title, String content, String photoUrl, Integer viewCnt, LocalDateTime createdAt, PhotoMetadata metadata) {
        this.questionId = questionId;
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.photoUrl = photoUrl;
        this.viewCnt = viewCnt;
        this.createdAt = createdAt;
        this.metadata = metadata;
    }

    public static GetQuestionDetailResponse from(Question question, QuestionDetail questionDetail) {
        return builder()
                .questionId(question.getId())
                .memberId(question.getMember().getId())
                .title(question.getTitle())
                .content(question.getContent())
                .photoUrl(null)
                .viewCnt(questionDetail.getViewCnt())
                .createdAt(question.getCreatedAt())
                .metadata(null)
                .build();
    }

    public static GetQuestionDetailResponse from(Question question, QuestionDetail questionDetail, Photo photo) {
        return builder()
                .questionId(question.getId())
                .memberId(question.getMember().getId())
                .title(question.getTitle())
                .content(question.getContent())
                .photoUrl(photo.getImageUrl())
                .viewCnt(questionDetail.getViewCnt())
                .createdAt(question.getCreatedAt())
                .metadata(PhotoMetadata.from(photo.getPhotoMetadata()))
                .build();
    }

}
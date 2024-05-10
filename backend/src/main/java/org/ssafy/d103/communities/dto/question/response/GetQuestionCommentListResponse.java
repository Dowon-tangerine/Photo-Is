package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.question.QuestionComment;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetQuestionCommentListResponse {

    private Integer commentCnt;
    private List<QuestionCommentDto> commentList;

    @Builder
    private GetQuestionCommentListResponse(Integer commentCnt, List<QuestionCommentDto> commentList) {
        this.commentCnt = commentCnt;
        this.commentList = commentList;
    }

    public static GetQuestionCommentListResponse of(Integer commentCnt, List<QuestionComment> commentList) {
        List<QuestionCommentDto> responseList = commentList.stream()
                .map(QuestionCommentDto::from)
                .collect(Collectors.toList());
        return builder()
                .commentCnt(commentCnt)
                .commentList(responseList)
                .build();
    }

}
package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.question.QuestionDto;

import java.util.List;

@Getter
public class GetQuestionListResponse {

    private Integer totalCnt;
    private List<QuestionDto> questionList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetQuestionListResponse(Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        this.totalCnt = totalCnt;
        this.questionList = questionList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetQuestionListResponse of(Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        return builder()
                .totalCnt(totalCnt)
                .questionList(questionList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
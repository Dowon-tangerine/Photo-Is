package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.question.QuestionDto;

import java.util.List;

@Getter
public class GetSearchQuestionResponse {

    private String filter;
    private Integer totalCnt;
    private List<QuestionDto> questionList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetSearchQuestionResponse(String filter, Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        this.filter = filter;
        this.totalCnt = totalCnt;
        this.questionList = questionList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetSearchQuestionResponse of(String filter, Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        return builder()
                .filter(filter)
                .totalCnt(totalCnt)
                .questionList(questionList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
package org.ssafy.d103.communities.dto.question.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.question.QuestionDto;

import java.util.List;

@Getter
public class GetQuestionListByCategoryResponse {

    private String category;
    private Integer totalCnt;
    private List<QuestionDto> questionList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetQuestionListByCategoryResponse(String category, Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        this.category = category;
        this.totalCnt = totalCnt;
        this.questionList = questionList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetQuestionListByCategoryResponse of(String category, Integer totalCnt, List<QuestionDto> questionList, PaginationDataDto paginationDataDto) {
        return builder()
                .category(category)
                .totalCnt(totalCnt)
                .questionList(questionList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
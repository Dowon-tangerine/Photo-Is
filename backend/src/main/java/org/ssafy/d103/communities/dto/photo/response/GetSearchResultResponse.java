package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;

import java.util.List;

@Getter
public class GetSearchResultResponse {

    private String searchKeyword;
    private String searchType;
    private Integer totalCnt;
    private List<?> resultList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetSearchResultResponse(String searchKeyword, String searchType, Integer totalCnt, List<?> resultList, PaginationDataDto paginationDataDto) {
        this.searchKeyword = searchKeyword;
        this.searchType = searchType;
        this.totalCnt = totalCnt;
        this.resultList = resultList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetSearchResultResponse of(String searchKeyword, String searchType, Integer totalCnt, List<?> resultList, PaginationDataDto paginationDataDto) {
        return builder()
                .searchKeyword(searchKeyword)
                .searchType(searchType)
                .totalCnt(totalCnt)
                .resultList(resultList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
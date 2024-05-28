package org.ssafy.d103.exhibitions.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.exhibitions.dto.ExhibitionDto;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class GetSelectMyExhibitionListResponse {

    private int totalCnt;
    private List<ExhibitionDto> content;

    @Builder
    private GetSelectMyExhibitionListResponse(int totalCnt, List<ExhibitionDto> content) {
        this.totalCnt = totalCnt;
        this.content = content;
    }

    public static GetSelectMyExhibitionListResponse from(List<ExhibitionDto> exhibitionDtoList) {
        return builder()
                .totalCnt(exhibitionDtoList.size())
                .content(exhibitionDtoList)
                .build();
    }
}

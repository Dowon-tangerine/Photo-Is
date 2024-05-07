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

    public static GetSelectMyExhibitionListResponse from(List<Exhibitions> exhibitionList) {
        return builder()
                .totalCnt(exhibitionList.size())
                .content(exhibitionList
                        .stream()
                        .map(ExhibitionDto::from)
                        .collect(Collectors.toList()))
                .build();
    }
}

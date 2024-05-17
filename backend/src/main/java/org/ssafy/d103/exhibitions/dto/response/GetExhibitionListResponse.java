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
public class GetExhibitionListResponse {

    private int totalCnt;
    private List<ExhibitionDto> followExhibition;
    private List<ExhibitionDto> exhibition;

    @Builder
    private GetExhibitionListResponse(int totalCnt, List<ExhibitionDto> followExhibition, List<ExhibitionDto> exhibition) {
        this.totalCnt = totalCnt;
        this.followExhibition = followExhibition;
        this.exhibition = exhibition;
    }

    public static GetExhibitionListResponse from(List<ExhibitionDto> followExhibitionDtoList, List<ExhibitionDto> exhibitionDtoList) {
        return builder()
                .totalCnt(exhibitionDtoList.size())
                .followExhibition(followExhibitionDtoList)
                .exhibition(exhibitionDtoList)
                .build();
    }

}

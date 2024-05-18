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
public class GetMemberExhibitionListResponse {
    private int totalCnt;
    private List<ExhibitionDto> exhibition;

    @Builder
    private GetMemberExhibitionListResponse(int totalCnt, List<ExhibitionDto> exhibition) {
        this.totalCnt = totalCnt;
        this.exhibition = exhibition;
    }

    public static GetMemberExhibitionListResponse from(List<ExhibitionDto> exhibitionDtoList) {
        return builder()
                .totalCnt(exhibitionDtoList.size())
                .exhibition(exhibitionDtoList)
                .build();
    }
}

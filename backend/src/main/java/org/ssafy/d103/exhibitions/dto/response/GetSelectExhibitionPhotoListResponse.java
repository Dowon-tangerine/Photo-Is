package org.ssafy.d103.exhibitions.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.exhibitions.dto.ExhibitionPhotoDto;

import java.util.List;

@Getter
@Setter
public class GetSelectExhibitionPhotoListResponse {

    private int totalCnt;
    private List<ExhibitionPhotoDto> content;

    @Builder
    private GetSelectExhibitionPhotoListResponse(int totalCnt, List<ExhibitionPhotoDto> content) {
        this.totalCnt = totalCnt;
        this.content = content;
    }

    public static GetSelectExhibitionPhotoListResponse from(List<ExhibitionPhotoDto> exhibitionPhotoDtoList) {
        return builder()
                .totalCnt(exhibitionPhotoDtoList.size())
                .content(exhibitionPhotoDtoList)
                .build();
    }
}

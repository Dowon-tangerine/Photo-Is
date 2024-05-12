package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.photo.PhotoDto;

import java.util.List;

@Getter
public class GetOthersPhotoResponse {

    private String accessType;
    private Integer totalCnt;
    private List<PhotoDto> photoList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetOthersPhotoResponse(String accessType, Integer totalCnt, List<PhotoDto> photoList, PaginationDataDto paginationDataDto) {
        this.accessType = accessType;
        this.totalCnt = totalCnt;
        this.photoList = photoList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetOthersPhotoResponse of(String accessType, Integer totalCnt, List<PhotoDto> photoList, PaginationDataDto paginationDataDto) {
        return builder()
                .accessType(accessType)
                .totalCnt(totalCnt)
                .photoList(photoList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
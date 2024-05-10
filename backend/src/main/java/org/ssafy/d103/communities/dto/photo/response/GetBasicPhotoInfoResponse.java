package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.photo.MyPhotoDto;

import java.util.List;

@Getter
public class GetBasicPhotoInfoResponse {

    private String accessType;
    private Integer totalCnt;
    private List<MyPhotoDto> photoList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetBasicPhotoInfoResponse(String accessType, Integer totalCnt, List<MyPhotoDto> photoList, PaginationDataDto paginationDataDto) {
        this.accessType = accessType;
        this.totalCnt = totalCnt;
        this.photoList = photoList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetBasicPhotoInfoResponse of(String accessType, Integer totalCnt, List<MyPhotoDto> photoList, PaginationDataDto paginationDataDto) {
        return builder()
                .accessType(accessType)
                .totalCnt(totalCnt)
                .photoList(photoList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
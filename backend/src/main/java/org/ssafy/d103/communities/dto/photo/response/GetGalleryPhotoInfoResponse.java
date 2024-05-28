package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.photo.PhotoDto;

import java.util.List;

@Getter
public class GetGalleryPhotoInfoResponse {

    private String filter;
    private Integer totalCnt;
    private List<PhotoDto> photoList;
    private PaginationDataDto paginationDataDto;

    @Builder
    private GetGalleryPhotoInfoResponse(String filter, Integer totalCnt, List<PhotoDto> photoList, PaginationDataDto paginationDataDto) {
        this.filter = filter;
        this.totalCnt = totalCnt;
        this.photoList = photoList;
        this.paginationDataDto = paginationDataDto;
    }

    public static GetGalleryPhotoInfoResponse of(String filter, Integer totalCnt, List<PhotoDto> photoList, PaginationDataDto paginationDataDto) {
        return builder()
                .filter(filter)
                .totalCnt(totalCnt)
                .photoList(photoList)
                .paginationDataDto(paginationDataDto)
                .build();
    }

}
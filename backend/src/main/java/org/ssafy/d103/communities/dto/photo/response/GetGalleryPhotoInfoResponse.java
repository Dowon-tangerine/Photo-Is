package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.Photo;

@Getter
public class GetGalleryPhotoInfoResponse {

    private Long photoId;
    private String thumbnailUrl;
    private String title;
    private Integer likeCnt;
    private Boolean isLiked;

    @Builder
    private GetGalleryPhotoInfoResponse(Long photoId, String thumbnailUrl, String title, Integer likeCnt, Boolean isLiked) {
        this.photoId = photoId;
        this.thumbnailUrl = thumbnailUrl;
        this.title = title;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
    }

    public static GetGalleryPhotoInfoResponse from(Photo photo, Integer likeCnt, Boolean isLiked) {
        return builder()
                .photoId(photo.getId())
                .thumbnailUrl(photo.getThumbnailUrl())
                .title(photo.getTitle())
                .likeCnt(likeCnt)
                .isLiked(isLiked)
                .build();
    }

}

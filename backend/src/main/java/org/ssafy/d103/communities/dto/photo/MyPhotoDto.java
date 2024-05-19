package org.ssafy.d103.communities.dto.photo;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.Photo;

@Getter
public class MyPhotoDto {

    private Long photoId;
    private String thumbnailUrl;
    private String imageUrl;
    private String title;
    private Integer likeCnt;

    @Builder
    private MyPhotoDto(Long photoId, String thumbnailUrl, String imageUrl, String title, Integer likeCnt) {
        this.photoId = photoId;
        this.thumbnailUrl = thumbnailUrl;
        this.imageUrl = imageUrl;
        this.title = title;
        this.likeCnt = likeCnt;
    }

    public static MyPhotoDto from(Photo photo, Integer likeCnt) {
        return builder()
                .photoId(photo.getId())
                .thumbnailUrl(photo.getThumbnailUrl())
                .imageUrl(photo.getImageUrl())
                .title(photo.getTitle())
                .likeCnt(likeCnt)
                .build();
    }

}
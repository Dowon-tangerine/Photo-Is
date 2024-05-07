package org.ssafy.d103.communities.dto.listDto;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.Photo;

@Getter
public class BasicPhotoInfo {

    private Long photoId;
    private String thumbnailUrl;
    private String title;
    private Integer likeCnt;

    @Builder
    private BasicPhotoInfo(Long photoId, String thumbnailUrl, String title, Integer likeCnt) {
        this.photoId = photoId;
        this.thumbnailUrl = thumbnailUrl;
        this.title = title;
        this.likeCnt = likeCnt;
    }

    public static BasicPhotoInfo from(Photo photo, Integer likeCnt) {
        return builder()
                .photoId(photo.getId())
                .thumbnailUrl(photo.getThumbnailUrl())
                .title(photo.getTitle())
                .likeCnt(likeCnt)
                .build();
    }

}
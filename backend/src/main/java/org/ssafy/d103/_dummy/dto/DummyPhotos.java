package org.ssafy.d103._dummy.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DummyPhotos {

    private Long photoId;
    private String thumbnailUrl;
    private String title;
    private int likeCnt;
    private boolean isLiked;

    @Builder
    public DummyPhotos(Long photoId, String thumbnailUrl, String title, int likeCnt, boolean isLiked) {
        this.photoId = photoId;
        this.thumbnailUrl = thumbnailUrl;
        this.title = title;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
    }
}

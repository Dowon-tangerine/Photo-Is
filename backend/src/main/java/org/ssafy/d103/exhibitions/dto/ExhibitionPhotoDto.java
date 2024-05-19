package org.ssafy.d103.exhibitions.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ssafy.d103.communities.entity.photo.PhotoHashtag;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionPhotoDto {

    private Long exhibitionPhotoId;
    private int number;
    private String title;
    private String photoUrl;
    private LocalDateTime time;
    private PhotoMetadata photoMetadata;
    private List<PhotoHashtag> hashtag;

    @Builder
    private ExhibitionPhotoDto(Long exhibitionPhotoId, int number, String title, String photoUrl, LocalDateTime time, PhotoMetadata photoMetadata, List<PhotoHashtag> hashtag) {
        this.exhibitionPhotoId = exhibitionPhotoId;
        this.number = number;
        this.title = title;
        this.photoUrl = photoUrl;
        this.time = time;
        this.photoMetadata = photoMetadata;
        this.hashtag = hashtag;
    }

    public static ExhibitionPhotoDto from(ExhibitionPhoto exhibitionPhoto) {
        return builder()
                .exhibitionPhotoId(exhibitionPhoto.getExhibitionId().getId())
                .number(exhibitionPhoto.getNumber())
                .title(exhibitionPhoto.getPhotoId().getTitle())
                .time(exhibitionPhoto.getPhotoId().getCreatedAt())
                .photoUrl(exhibitionPhoto.getPhotoId().getImageUrl())
                .photoMetadata(exhibitionPhoto.getPhotoId().getPhotoMetadata())
                .hashtag(exhibitionPhoto.getPhotoId().getPhotoHashtagList())
                .build();
    }
}

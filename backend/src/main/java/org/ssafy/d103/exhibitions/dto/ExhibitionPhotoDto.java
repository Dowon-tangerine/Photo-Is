package org.ssafy.d103.exhibitions.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionPhotoDto {

    private Long exhibitionPhotoId;
    private int number;
    private String title;
    private String photoUrl;
    private LocalDateTime time;

    @Builder
    private ExhibitionPhotoDto(Long exhibitionPhotoId, int number, String title, String photoUrl, LocalDateTime time) {
        this.exhibitionPhotoId = exhibitionPhotoId;
        this.number = number;
        this.title = title;
        this.photoUrl = photoUrl;
        this.time = time;
    }

    public static ExhibitionPhotoDto from(ExhibitionPhoto exhibitionPhoto) {
        return builder()
                .exhibitionPhotoId(exhibitionPhoto.getExhibitionId().getId())
                .number(exhibitionPhoto.getNumber())
                .time(exhibitionPhoto.getPhotoId().getCreatedAt())
                .photoUrl(exhibitionPhoto.getPhotoId().getImageUrl())
                .build();
    }
}

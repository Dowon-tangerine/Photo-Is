package org.ssafy.d103.exhibitions.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionPhotoIdDto {

    private long photoId;
    private int number;

    public ExhibitionPhotoIdDto(long photoId, int number) {
        this.photoId = photoId;
        this.number = number;
    }
}

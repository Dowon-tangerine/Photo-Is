package org.ssafy.d103.exhibitions.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionPhotoIdDto {

    private long photoId;

    public ExhibitionPhotoIdDto(int photoId) {
        this.photoId = photoId;
    }
}

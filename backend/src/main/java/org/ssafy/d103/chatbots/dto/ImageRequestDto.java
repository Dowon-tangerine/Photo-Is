package org.ssafy.d103.chatbots.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ImageRequestDto {
    private String image_url;

    public ImageRequestDto(String image_url) {
        this.image_url = image_url;
    }
}

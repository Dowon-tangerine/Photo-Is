package org.ssafy.d103.chatbots.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ImageRequestDto {
    private String imageUrl;

    public ImageRequestDto(String image_url) {
        this.imageUrl = image_url;
    }
}

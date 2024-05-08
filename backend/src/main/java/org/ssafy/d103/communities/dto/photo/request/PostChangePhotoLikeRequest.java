package org.ssafy.d103.communities.dto.photo.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Data
@Getter
@RequiredArgsConstructor
public class PostChangePhotoLikeRequest {

    @NotNull(message = "사진의 ID를 입력해주세요.")
    private Long photoId;

}
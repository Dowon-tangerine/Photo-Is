package org.ssafy.d103.communities.dto.photo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PutSaveStudioMetadataRequest {

    @NotBlank(message = "iso 값을 입력해주세요.")
    private String iso;

    @NotBlank(message = "shutterSpeed 값을 입력해주세요.")
    private String shutterSpeed;

    @NotBlank(message = "aperture 값을 입력해주세요.")
    private String aperture;

    @NotBlank(message = "exposure 값을 입력해주세요.")
    private String exposure;

}
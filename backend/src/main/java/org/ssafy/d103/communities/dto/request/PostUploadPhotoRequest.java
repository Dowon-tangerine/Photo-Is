package org.ssafy.d103.communities.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Data
@Getter
@RequiredArgsConstructor
public class PostUploadPhotoRequest {

    @NotBlank(message = "제목이 없습니다.")
    private String title;

    @NotBlank(message = "accessType이 없습니다.")
    private String accessType;

}
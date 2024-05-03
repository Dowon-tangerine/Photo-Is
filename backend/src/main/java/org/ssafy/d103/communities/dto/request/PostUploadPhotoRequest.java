package org.ssafy.d103.communities.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@Getter
@RequiredArgsConstructor
public class PostUploadPhotoRequest {

    @NotBlank(message = "제목이 없습니다.")
    private String title;

    @NotBlank(message = "accessType이 없습니다.")
    private String accessType;

    @NotBlank(message = "해시태그 리스트가 없습니다.")
    private List<String> hashtagList;

}
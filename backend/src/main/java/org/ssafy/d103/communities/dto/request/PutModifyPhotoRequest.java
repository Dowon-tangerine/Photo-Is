package org.ssafy.d103.communities.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class PutModifyPhotoRequest {

    @NotNull(message = "수정할 사진의 ID를 입력해주세요.")
    private Long photoId;

    @NotBlank(message = "수정할 제목을 입력해주세요")
    private String title;

    @NotBlank(message = "accessType을 입력해주세요")
    private String accessType;

    @NotBlank(message = "수정할 해시태그 리스트를 입력해주세요.")
    private List<String> hashtagList;

}

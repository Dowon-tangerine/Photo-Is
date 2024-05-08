package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.AccessType;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PutModifyPhotoResponse {

    private String title;
    private AccessType accessType;
    private LocalDateTime createAt;
    private List<String> hashtagList;

    @Builder
    private PutModifyPhotoResponse(String title, AccessType accessType, LocalDateTime createAt, List<String> hashtagList) {
        this.title = title;
        this.accessType = accessType;
        this.createAt = createAt;
        this.hashtagList = hashtagList;
    }

    public static PutModifyPhotoResponse of(String title, AccessType accessType, LocalDateTime createAt, List<String> hashtagList) {
        return builder()
                .title(title)
                .accessType(accessType)
                .createAt(createAt)
                .hashtagList(hashtagList)
                .build();
    }

}
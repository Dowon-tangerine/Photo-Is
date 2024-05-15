package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.photo.PhotoRankingDto;

import java.util.List;

@Getter
public class GetPhotoRankingResponse {

    private String type;
    private List<PhotoRankingDto> rankings;

    @Builder
    private GetPhotoRankingResponse(String type, List<PhotoRankingDto> rankings) {
        this.type = type;
        this.rankings = rankings;
    }

    public static GetPhotoRankingResponse of(String type, List<PhotoRankingDto> rankings) {
        return builder()
                .type(type)
                .rankings(rankings)
                .build();
    }

}
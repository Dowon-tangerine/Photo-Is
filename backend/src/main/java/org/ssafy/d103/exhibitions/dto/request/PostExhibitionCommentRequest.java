package org.ssafy.d103.exhibitions.dto.request;

import lombok.Getter;

@Getter
public class PostExhibitionCommentRequest {

    private Long exhibitionId;
    private String comment;
}

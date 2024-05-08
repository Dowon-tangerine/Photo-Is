package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class GetPhotoCommentListResponse {

    private Integer commentCnt;
    private List<PhotoCommentResponse> commentList;

    @Builder
    private GetPhotoCommentListResponse(Integer commentCnt, List<PhotoCommentResponse> commentList) {
        this.commentCnt = commentCnt;
        this.commentList = commentList;
    }

    public static GetPhotoCommentListResponse of(Integer commentCnt, List<PhotoComment> commentList) {
        List<PhotoCommentResponse> responseList = commentList.stream()
                .map(PhotoCommentResponse::from)
                .collect(Collectors.toList());
        return builder()
                .commentCnt(commentCnt)
                .commentList(responseList)
                .build();
    }

}
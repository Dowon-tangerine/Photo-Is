package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostWriteCommentResponse {

    private Integer commentCnt;
    private List<PhotoCommentListResponse> commentList;

    @Builder
    private PostWriteCommentResponse(Integer commentCnt, List<PhotoCommentListResponse> commentList) {
        this.commentCnt = commentCnt;
        this.commentList = commentList;
    }

    public static PostWriteCommentResponse of(Integer commentCnt, List<PhotoComment> commentList) {
        List<PhotoCommentListResponse> responseList = commentList.stream()
                .map(PhotoCommentListResponse::from)
                .collect(Collectors.toList());
        return builder()
                .commentCnt(commentCnt)
                .commentList(responseList)
                .build();
    }

}
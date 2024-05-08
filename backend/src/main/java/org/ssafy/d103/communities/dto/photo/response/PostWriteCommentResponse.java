package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostWriteCommentResponse {

    private Integer commentCnt;
    private List<PhotoCommentResponse> commentList;

    @Builder
    private PostWriteCommentResponse(Integer commentCnt, List<PhotoCommentResponse> commentList) {
        this.commentCnt = commentCnt;
        this.commentList = commentList;
    }

    public static PostWriteCommentResponse of(Integer commentCnt, List<PhotoComment> commentList) {
        List<PhotoCommentResponse> responseList = commentList.stream()
                .map(PhotoCommentResponse::from)
                .collect(Collectors.toList());
        return builder()
                .commentCnt(commentCnt)
                .commentList(responseList)
                .build();
    }

}
package org.ssafy.d103.communities.dto.photo.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.dto.photo.PhotoCommentDto;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostWriteCommentResponse {

    private Integer commentCnt;
    private List<PhotoCommentDto> commentList;

    @Builder
    private PostWriteCommentResponse(Integer commentCnt, List<PhotoCommentDto> commentList) {
        this.commentCnt = commentCnt;
        this.commentList = commentList;
    }

    public static PostWriteCommentResponse of(Integer commentCnt, List<PhotoComment> commentList) {
        List<PhotoCommentDto> responseList = commentList.stream()
                .map(PhotoCommentDto::from)
                .collect(Collectors.toList());
        return builder()
                .commentCnt(commentCnt)
                .commentList(responseList)
                .build();
    }

}
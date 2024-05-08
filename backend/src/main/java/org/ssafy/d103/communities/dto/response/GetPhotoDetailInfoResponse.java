package org.ssafy.d103.communities.dto.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class GetPhotoDetailInfoResponse {

    private Long photoId;
    private Long memberId;
    private String nickname;
    private String title;
    private String imageUrl;
    private Integer viewCnt;
    private Integer commentCnt;
    private Integer likeCnt;
    private Boolean isLiked;
    private LocalDateTime createdAt;
    private String accessType;
    private PhotoMetadata metadata;
    private List<String> hashtagList;

    @Builder
    private GetPhotoDetailInfoResponse(Long photoId, Long memberId, String nickname, String title, String imageUrl, Integer viewCnt, Integer commentCnt, Integer likeCnt, Boolean isLiked, LocalDateTime createdAt, String accessType, PhotoMetadata metadata, List<String> hashtagList) {
        this.photoId = photoId;
        this.memberId = memberId;
        this.nickname = nickname;
        this.title = title;
        this.imageUrl = imageUrl;
        this.viewCnt = viewCnt;
        this.commentCnt = commentCnt;
        this.likeCnt = likeCnt;
        this.isLiked = isLiked;
        this.createdAt = createdAt;
        this.accessType = accessType;
        this.metadata = metadata;
        this.hashtagList = hashtagList;
    }

    public static GetPhotoDetailInfoResponse of(Photo photo, PhotoDetail photoDetail, boolean isLiked, PhotoMetadata metadata, List<String> hashtagList) {
        return builder()
                .photoId(photo.getId())
                .memberId(photo.getMember().getId())
                .nickname(photo.getMember().getNickname())
                .title(photo.getTitle())
                .imageUrl(photo.getImageUrl())
                .viewCnt(photoDetail.getViewCnt())
                .commentCnt(photoDetail.getCommentCnt())
                .likeCnt(photoDetail.getLikeCnt())
                .isLiked(isLiked)
                .createdAt(photo.getCreatedAt())
                .accessType(photo.getAccessType().toString())
                .metadata(metadata)
                .hashtagList(hashtagList)
                .build();
    }
}
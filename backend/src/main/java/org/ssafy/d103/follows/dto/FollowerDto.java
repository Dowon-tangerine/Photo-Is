package org.ssafy.d103.follows.dto;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.follows.entity.Follows;

@Getter
public class FollowerDto {

    private Long memberId;
    private String profileUrl;
    private String nickname;

    @Builder
    private FollowerDto(Long memberId, String profileUrl, String nickname) {
        this.memberId = memberId;
        this.profileUrl = profileUrl;
        this.nickname = nickname;
    }

    public static FollowerDto from(Follows follow) {
        return builder()
                .memberId(follow.getFollowerId().getId())
                .profileUrl(follow.getFollowerId().getProfileUrl())
                .nickname(follow.getFollowerId().getNickname())
                .build();
    }
}

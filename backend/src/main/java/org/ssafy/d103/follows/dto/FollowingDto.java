package org.ssafy.d103.follows.dto;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103.follows.entity.Follows;

@Getter
public class FollowingDto {

    private Long memberId;
    private String profileUrl;
    private String nickname;

    @Builder
    private FollowingDto(Long memberId, String profileUrl, String nickname) {
        this.memberId = memberId;
        this.profileUrl = profileUrl;
        this.nickname = nickname;
    }

    public static FollowingDto from(Follows follow) {
        return builder()
                .memberId(follow.getFollowingId().getId())
                .profileUrl(follow.getFollowingId().getProfileUrl())
                .nickname(follow.getFollowingId().getNickname())
                .build();
    }
}

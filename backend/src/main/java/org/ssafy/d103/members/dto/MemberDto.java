package org.ssafy.d103.members.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.members.entity.Members;

@Getter
@Setter
public class MemberDto {

    private Long memberId;
    private String profileUrl;
    private String nickname;
    private int photoCnt;
    private int followingCnt;
    private int followerCnt;
    private boolean isFollowing;

    @Builder
    private MemberDto(Long memberId, String profileUrl, String nickname, int photoCnt, int followingCnt, int followerCnt, boolean isFollowing) {
        this.memberId = memberId;
        this.profileUrl = profileUrl;
        this.nickname = nickname;
        this.photoCnt = photoCnt;
        this.followingCnt = followingCnt;
        this.followerCnt = followerCnt;
        this.isFollowing = isFollowing;
    }

    public static MemberDto of(Members member, boolean isFollowing) {
        return builder()
                .memberId(member.getId())
                .profileUrl(member.getProfileUrl())
                .nickname(member.getNickname())
                .photoCnt(member.getPhotoCnt())
                .followingCnt(member.getFollowingCnt())
                .followerCnt(member.getFollowerCnt())
                .isFollowing(isFollowing)
                .build();
    }
}

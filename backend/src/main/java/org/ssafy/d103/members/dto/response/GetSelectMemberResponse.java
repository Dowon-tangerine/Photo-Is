package org.ssafy.d103.members.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.members.entity.Members;

@Getter
@Setter
public class GetSelectMemberResponse {

    private Long memberId;
    private String nickname;
    private String profileUrl;
    private String backgroundUrl;
    private String introduction;
    private int followingCnt;
    private int followerCnt;
    private int photoCnt;

    @Builder
    private GetSelectMemberResponse(Long memberId, String nickname, String profileUrl, String backgroundUrl, String introduction, int followingCnt, int followerCnt, int photoCnt) {
        this.memberId = memberId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.backgroundUrl = backgroundUrl;
        this.introduction = introduction;
        this.followingCnt = followingCnt;
        this.followerCnt = followerCnt;
        this.photoCnt = photoCnt;
    }

    public static GetSelectMemberResponse from(Members member) {
        return builder()
                .memberId(member.getId())
                .nickname(member.getNickname())
                .profileUrl(member.getProfileUrl())
                .backgroundUrl(member.getBackgroundUrl())
                .introduction(member.getIntroduction())
                .followingCnt(member.getFollowingCnt())
                .followerCnt(member.getFollowerCnt())
                .photoCnt(member.getPhotoCnt())
                .build();
    }
}

package org.ssafy.d103.members.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.ssafy.d103.members.entity.Members;

@Getter
@Setter
public class GetSelectMemberListResponse {

    private Long memberId;
    private String profileUrl;
    private String nickname;
    private int photoCnt;
    private int followingCnt;
    private int followerCnt;
    private boolean isFollowing;

    @Builder
    private GetSelectMemberListResponse(Long memberId, String profileUrl, String nickname, int photoCnt, int followingCnt, int followerCnt, boolean isFollowing) {
        this.memberId = memberId;
        this.profileUrl = profileUrl;
        this.nickname = nickname;
        this.photoCnt = photoCnt;
        this.followingCnt = followingCnt;
        this.followerCnt = followerCnt;
        this.isFollowing = isFollowing;
    }

}

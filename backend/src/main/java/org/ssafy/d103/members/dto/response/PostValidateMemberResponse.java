package org.ssafy.d103.members.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.members.entity.Members;

@Getter
@Setter
public class PostValidateMemberResponse {

    Long memberId;
    String nickname;
    String profileUrl;

    @Builder
    private PostValidateMemberResponse(Long memberId, String nickname, String profileUrl) {
        this.memberId = memberId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
    }

    public static PostValidateMemberResponse from(Members member) {
        return builder()
                .memberId(member.getId())
                .nickname(member.getNickname())
                .profileUrl(member.getProfileUrl())
                .build();
    }
}

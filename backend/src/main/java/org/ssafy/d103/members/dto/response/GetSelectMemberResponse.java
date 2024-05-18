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
    private int useYear;
    private int birthYear;
    private Members.Camera camera;
    private String city;
    private String country;
    private boolean isFollow;

    @Builder
    private GetSelectMemberResponse(Long memberId, String nickname, String profileUrl, String backgroundUrl, String introduction, int followingCnt, int followerCnt, int photoCnt, int useYear, int birthYear, Members.Camera camera, String city, String country, boolean isFollow) {
        this.memberId = memberId;
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.backgroundUrl = backgroundUrl;
        this.introduction = introduction;
        this.followingCnt = followingCnt;
        this.followerCnt = followerCnt;
        this.photoCnt = photoCnt;
        this.useYear = useYear;
        this.birthYear = birthYear;
        this.camera = camera;
        this.city = city;
        this.country = country;
        this.isFollow = isFollow;
    }

    public static GetSelectMemberResponse from(Members member, boolean isFollow) {
        return builder()
                .memberId(member.getId())
                .nickname(member.getNickname())
                .profileUrl(member.getProfileUrl())
                .backgroundUrl(member.getBackgroundUrl())
                .introduction(member.getIntroduction())
                .followingCnt(member.getFollowingCnt())
                .followerCnt(member.getFollowerCnt())
                .photoCnt(member.getPhotoCnt())
                .useYear(member.getUseYear())
                .birthYear(member.getBirthYear())
                .camera(member.getCamera())
                .city(member.getCity())
                .country(member.getCountry())
                .isFollow(isFollow)
                .build();
    }
}

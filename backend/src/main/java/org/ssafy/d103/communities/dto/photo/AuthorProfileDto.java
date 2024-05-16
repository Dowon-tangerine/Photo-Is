package org.ssafy.d103.communities.dto.photo;

import lombok.Builder;
import lombok.Getter;

@Getter
public class AuthorProfileDto {

    private String nickname;
    private String profileUrl;
    private Integer useYear;
    private String city;
    private String country;
    private Integer uploadedPhotoCnt;
    private Integer followingCnt;
    private Integer followerCnt;
    private boolean isFollow;

    @Builder
    private AuthorProfileDto(String nickname, String profileUrl, Integer useYear, String city, String country, Integer uploadedPhotoCnt, Integer followingCnt, Integer followerCnt, boolean isFollow) {
        this.nickname = nickname;
        this.profileUrl = profileUrl;
        this.useYear = useYear;
        this.city = city;
        this.country = country;
        this.uploadedPhotoCnt = uploadedPhotoCnt;
        this.followingCnt = followingCnt;
        this.followerCnt = followerCnt;
        this.isFollow = isFollow;
    }

    public static AuthorProfileDto of(String nickname, String profileUrl, Integer useYear, String city, String country, Integer uploadedPhotoCnt, Integer followingCnt, Integer followerCnt, boolean isFollow) {
        return builder()
                .nickname(nickname)
                .profileUrl(profileUrl)
                .useYear(useYear)
                .city(city)
                .country(country)
                .uploadedPhotoCnt(uploadedPhotoCnt)
                .followingCnt(followingCnt)
                .followerCnt(followerCnt)
                .isFollow(isFollow)
                .build();
    }

}
package org.ssafy.d103.members.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.d103.members.entity.Members;

@Getter
@Setter
public class PutUpdateMemberResponse {

    private String nickname;
    private int birthYear;
    private int useYear;
    private Members.Camera camera;
    private String profileUrl;
    private String country;
    private String city;

    @Builder
    private PutUpdateMemberResponse(String nickname, int birthYear, int useYear, Members.Camera camera, String profileUrl, String country, String city) {
        this.nickname = nickname;
        this.birthYear = birthYear;
        this.useYear = useYear;
        this.camera = camera;
        this.profileUrl = profileUrl;
        this.country = country;
        this.city = city;
    }

    public static PutUpdateMemberResponse from(Members member) {
        return builder()
                .nickname(member.getNickname())
                .birthYear(member.getBirthYear())
                .useYear(member.getUseYear())
                .camera(member.getCamera())
                .profileUrl(member.getProfileUrl())
                .country(member.getCountry())
                .city(member.getCity())
                .build();
    }
}

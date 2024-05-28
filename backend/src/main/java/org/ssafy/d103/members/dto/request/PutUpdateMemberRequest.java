package org.ssafy.d103.members.dto.request;

import lombok.Getter;
import org.ssafy.d103.members.entity.Members;

@Getter
public class PutUpdateMemberRequest {

    private String password;
    private String introduction;
    private String nickname;
    private int birthYear;
    private int useYear;
    private Members.Camera camera;
    private String country;
    private String city;
}

package org.ssafy.d103.members.dto.request;

import lombok.Getter;

@Getter
public class PostMemberRequest {

    private String email;
    private String password;
    private String nickname;
    private int birthYear;
    private int useYear;
}

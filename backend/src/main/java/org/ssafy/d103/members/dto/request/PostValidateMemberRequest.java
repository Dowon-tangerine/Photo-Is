package org.ssafy.d103.members.dto.request;

import lombok.Getter;

@Getter
public class PostValidateMemberRequest {

    private String email;
    private String password;
}

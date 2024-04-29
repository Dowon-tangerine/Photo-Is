package org.ssafy.d103.communities.entity.question;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {

    NORMAL("일반"),
    STUDIO("가상 스튜디오")
    ;

    private final String CategoryName;

}
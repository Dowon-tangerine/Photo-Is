package org.ssafy.d103.communities.entity.photo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AccessType {

    PUBLIC("공개"),
    PRIVATE("비공개"),
    STUDIO("가상 스튜디오")
    ;

    private final String AccessTypeName;

}
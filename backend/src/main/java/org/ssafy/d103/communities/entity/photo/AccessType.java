package org.ssafy.d103.communities.entity.photo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AccessType {

    PUBLIC("public"),
    PRIVATE("private"),
    STUDIO("studio"),
    QNA("qna");

    private final String AccessTypeName;

    public static AccessType fromString(String accessTypeName) {
        for (AccessType b : AccessType.values()) {
            if (b.AccessTypeName.equalsIgnoreCase(accessTypeName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with accessTypeName " + accessTypeName + " found");
    }
}
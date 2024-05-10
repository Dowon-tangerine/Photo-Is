package org.ssafy.d103.communities.entity.photo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SearchType {

    TITLE("title"),
    AUTHOR("author"),
    HASHTAG("hashtag"),
    ;

    private final String SearchTypeName;

    public static SearchType fromString(String searchTypeName) {
        for (SearchType b : SearchType.values()) {
            if (b.SearchTypeName.equalsIgnoreCase(searchTypeName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with searchTypeName " + searchTypeName + " found");
    }

}
package org.ssafy.d103.communities.entity.question;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SearchFilter {

    TITLE("title"),
    AUTHOR("author"),
    ;

    private final String SearchFilterName;

    public static SearchFilter fromString(String searchFilterName) {
        for (SearchFilter b : SearchFilter.values()) {
            if (b.SearchFilterName.equalsIgnoreCase(searchFilterName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with searchFilterName " + searchFilterName + " found");
    }

}
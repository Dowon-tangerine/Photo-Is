package org.ssafy.d103.communities.entity.photo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Filter {

    LATEST("latest"),
    LIKE("like"),
    VIEW("view"),
    ;

    private final String FilterName;

    public static Filter fromString(String filterName) {
        for (Filter b : Filter.values()) {
            if (b.FilterName.equalsIgnoreCase(filterName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with filterName " + filterName + " found");
    }

}
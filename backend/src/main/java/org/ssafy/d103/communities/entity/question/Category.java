package org.ssafy.d103.communities.entity.question;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {

    NORMAL("normal"),
    STUDIO("studio");

    private final String CategoryName;

    public static Category fromString(String categoryName) {
        for (Category b : Category.values()) {
            if (b.CategoryName.equalsIgnoreCase(categoryName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with categoryName " + categoryName + " found");
    }

}
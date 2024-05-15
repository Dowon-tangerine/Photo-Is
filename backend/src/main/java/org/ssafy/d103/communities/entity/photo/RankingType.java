package org.ssafy.d103.communities.entity.photo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RankingType {

    DAILY("daily"),
    WEEKLY("weekly"),
    MONTHLY("monthly");

    private final String RankingTypeName;

    public static RankingType fromString(String rankingTypeName) {
        for (RankingType b : RankingType.values()) {
            if (b.RankingTypeName.equalsIgnoreCase(rankingTypeName)) {
                return b;
            }
        }
        throw new IllegalArgumentException("No constant with rankingTypeName " + rankingTypeName + " found");
    }

}
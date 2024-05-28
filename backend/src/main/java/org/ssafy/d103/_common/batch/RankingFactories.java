package org.ssafy.d103._common.batch;

import org.ssafy.d103.communities.entity.photo.DailyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.MonthlyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.WeeklyPhotoRanking;

public class RankingFactories {

    public static RankingProcessor.RankingFactory<DailyPhotoRanking> dailyPhotoRankingFactory() {
        return DailyPhotoRanking::of;
    }

    public static RankingProcessor.RankingFactory<WeeklyPhotoRanking> weeklyPhotoRankingFactory() {
        return WeeklyPhotoRanking::of;
    }

    public static RankingProcessor.RankingFactory<MonthlyPhotoRanking> monthlyPhotoRankingFactory() {
        return MonthlyPhotoRanking::of;
    }

}
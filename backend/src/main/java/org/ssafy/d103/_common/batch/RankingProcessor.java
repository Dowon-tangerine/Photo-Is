package org.ssafy.d103._common.batch;

import org.springframework.batch.item.ItemProcessor;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;
import org.ssafy.d103.communities.service.PhotoRankingService;

import java.util.List;
import java.util.stream.Collectors;

public class RankingProcessor<R> implements ItemProcessor<PhotoDetail, R> {

    private final PhotoRankingService photoRankingService;
    private final RankingFactory<R> rankingFactory;
    private final String rankingType;
    private List<PhotoDetail> sortedItems;

    public RankingProcessor(PhotoRankingService photoRankingService, RankingFactory<R> rankingFactory, String rankingType) {
        this.photoRankingService = photoRankingService;
        this.rankingFactory = rankingFactory;
        this.rankingType = rankingType;
    }

    public void initializeSortedItems() {
        switch (rankingType) {
            case "daily":
                this.sortedItems = photoRankingService.calculateDailyRankings();
                break;
            case "weekly":
                this.sortedItems = photoRankingService.calculateWeeklyRankings();
                break;
            case "monthly":
                this.sortedItems = photoRankingService.calculateMonthlyRankings();
                break;
            default:
                throw new IllegalArgumentException("Unknown ranking type: " + rankingType);
        }
    }

    @Override
    public R process(PhotoDetail item) {
        // 개별 항목을 처리하지 않고 전체 랭킹을 생성한 후 반환
        return null;
    }

    public List<R> getRankings() {
        return sortedItems.stream()
                .map(sortedItem -> {
                    int currentIndex = sortedItems.indexOf(sortedItem) + 1;
                    return rankingFactory.createRanking(currentIndex, sortedItem.getPhoto());
                })
                .limit(9)
                .collect(Collectors.toList());
    }

    public interface RankingFactory<R> {
        R createRanking(int ranking, Photo photo);
    }

}
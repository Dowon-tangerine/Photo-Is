package org.ssafy.d103.communities.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.d103.communities.entity.photo.DailyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.MonthlyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;
import org.ssafy.d103.communities.entity.photo.WeeklyPhotoRanking;
import org.ssafy.d103.communities.repository.photo.DailyPhotoRankingRepository;
import org.ssafy.d103.communities.repository.photo.MonthlyPhotoRankingRepository;
import org.ssafy.d103.communities.repository.photo.PhotoDetailRepository;
import org.ssafy.d103.communities.repository.photo.WeeklyPhotoRankingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoRankingService {

    private final PhotoDetailRepository photoDetailRepository;
    private final DailyPhotoRankingRepository dailyPhotoRankingRepository;
    private final WeeklyPhotoRankingRepository weeklyPhotoRankingRepository;
    private final MonthlyPhotoRankingRepository monthlyPhotoRankingRepository;

    @Transactional
    public List<PhotoDetail> calculateDailyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        return photoDetails.stream()
                .filter(p -> p.getDailyLikeUpdatedAt() != null)
                .sorted((p1, p2) -> {
                    int compareLikes = p2.getDailyLikeCnt().compareTo(p1.getDailyLikeCnt());
                    if (compareLikes == 0) {
                        compareLikes = p1.getDailyLikeUpdatedAt().compareTo(p2.getDailyLikeUpdatedAt());
                        if (compareLikes == 0) {
                            compareLikes = p2.getLikeCnt().compareTo(p1.getLikeCnt());
                        }
                    }
                    return compareLikes;
                })
                .limit(10)
                .toList();
    }

    @Transactional
    public List<PhotoDetail> calculateWeeklyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        return photoDetails.stream()
                .filter(p -> p.getWeeklyLikeUpdatedAt() != null)
                .sorted((p1, p2) -> {
                    int compareLikes = p2.getWeeklyLikeCnt().compareTo(p1.getWeeklyLikeCnt());
                    if (compareLikes == 0) {
                        compareLikes = p1.getWeeklyLikeUpdatedAt().compareTo(p2.getWeeklyLikeUpdatedAt());
                        if (compareLikes == 0) {
                            compareLikes = p2.getLikeCnt().compareTo(p1.getLikeCnt());
                        }
                    }
                    return compareLikes;
                })
                .limit(10)
                .toList();
    }

    @Transactional
    public List<PhotoDetail> calculateMonthlyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        return photoDetails.stream()
                .filter(p -> p.getMonthlyLikeUpdatedAt() != null)
                .sorted((p1, p2) -> {
                    int compareLikes = p2.getMonthlyLikeCnt().compareTo(p1.getMonthlyLikeCnt());
                    if (compareLikes == 0) {
                        compareLikes = p1.getMonthlyLikeUpdatedAt().compareTo(p2.getMonthlyLikeUpdatedAt());
                        if (compareLikes == 0) {
                            compareLikes = p2.getLikeCnt().compareTo(p1.getLikeCnt());
                        }
                    }
                    return compareLikes;
                })
                .limit(10)
                .toList();
    }

    @Transactional
    public void saveDailyPhotoRankings(List<DailyPhotoRanking> rankings) {
        dailyPhotoRankingRepository.deleteAll();
        dailyPhotoRankingRepository.flush();
        dailyPhotoRankingRepository.saveAll(rankings);
    }

    @Transactional
    public void saveWeeklyPhotoRankings(List<WeeklyPhotoRanking> rankings) {
        weeklyPhotoRankingRepository.deleteAll();
        weeklyPhotoRankingRepository.flush();
        weeklyPhotoRankingRepository.saveAll(rankings);
    }

    @Transactional
    public void saveMonthlyPhotoRankings(List<MonthlyPhotoRanking> rankings) {
        monthlyPhotoRankingRepository.deleteAll();
        monthlyPhotoRankingRepository.flush();
        monthlyPhotoRankingRepository.saveAll(rankings);
    }

}
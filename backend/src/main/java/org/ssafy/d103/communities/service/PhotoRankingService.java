package org.ssafy.d103.communities.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.d103.communities.entity.photo.*;
import org.ssafy.d103.communities.repository.photo.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoRankingService {

    private final PhotoDetailRepository photoDetailRepository;
    private final DailyPhotoRankingRepository dailyPhotoRankingRepository;
    private final WeeklyPhotoRankingRepository weeklyPhotoRankingRepository;
    private final MonthlyPhotoRankingRepository monthlyPhotoRankingRepository;

    @Transactional
    public void calculateDailyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        List<PhotoDetail> sortedPhotos = photoDetails.stream()
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
                .limit(9)
                .toList();

        dailyPhotoRankingRepository.deleteAll();
        dailyPhotoRankingRepository.flush();

        LocalDateTime localDateTime = LocalDateTime.now();

        for (int i = 0; i < sortedPhotos.size(); i++) {
            PhotoDetail photoDetail = sortedPhotos.get(i);
            DailyPhotoRanking dailyRanking = DailyPhotoRanking.builder()
                    .dailyRanking(i + 1)
                    .photo(photoDetail.getPhoto())
                    .build();
            dailyPhotoRankingRepository.save(dailyRanking);
            photoDetail.resetDailyLikeCnt(localDateTime);
            photoDetailRepository.save(photoDetail);
        }
    }

    @Transactional
    public void calculateWeeklyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        List<PhotoDetail> sortedPhotos = photoDetails.stream()
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
                .limit(9)
                .toList();

        weeklyPhotoRankingRepository.deleteAll();
        weeklyPhotoRankingRepository.flush();

        LocalDateTime localDateTime = LocalDateTime.now();

        for (int i = 0; i < sortedPhotos.size(); i++) {
            PhotoDetail photoDetail = sortedPhotos.get(i);
            WeeklyPhotoRanking weeklyRanking = WeeklyPhotoRanking.builder()
                    .weeklyRanking(i + 1)
                    .photo(photoDetail.getPhoto())
                    .build();
            weeklyPhotoRankingRepository.save(weeklyRanking);
            photoDetail.resetWeeklyLikeCnt(localDateTime);
            photoDetailRepository.save(photoDetail);
        }
    }

    @Transactional
    public void calculateMonthlyRankings() {
        List<PhotoDetail> photoDetails = photoDetailRepository.findAll();

        List<PhotoDetail> sortedPhotos = photoDetails.stream()
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
                .limit(9)
                .toList();

        monthlyPhotoRankingRepository.deleteAll();
        monthlyPhotoRankingRepository.flush();

        LocalDateTime localDateTime = LocalDateTime.now();

        for (int i = 0; i < sortedPhotos.size(); i++) {
            PhotoDetail photoDetail = sortedPhotos.get(i);
            MonthlyPhotoRanking monthlyRanking = MonthlyPhotoRanking.builder()
                    .monthlyRanking(i + 1)
                    .photo(photoDetail.getPhoto())
                    .build();
            monthlyPhotoRankingRepository.save(monthlyRanking);
            photoDetail.resetMonthlyLikeCnt(localDateTime);
            photoDetailRepository.save(photoDetail);
        }
    }
}
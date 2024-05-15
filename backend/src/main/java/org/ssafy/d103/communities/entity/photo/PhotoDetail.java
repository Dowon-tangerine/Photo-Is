package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhotoDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_detail_id")
    private Long photoDetailId;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer likeCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer commentCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer viewCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer dailyLikeCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer weeklyLikeCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer monthlyLikeCnt;

    @Column(nullable = false)
    private LocalDateTime dailyLikeUpdatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime weeklyLikeUpdatedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime monthlyLikeUpdatedAt = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private PhotoDetail(Integer likeCnt, Integer commentCnt, Integer viewCnt, Integer dailyLikeCnt, Integer weeklyLikeCnt, Integer monthlyLikeCnt, LocalDateTime dailyLikeUpdatedAt, LocalDateTime weeklyLikeUpdatedAt, LocalDateTime monthlyLikeUpdatedAt, Photo photo) {
        this.likeCnt = likeCnt;
        this.commentCnt = commentCnt;
        this.viewCnt = viewCnt;
        this.dailyLikeCnt = dailyLikeCnt;
        this.weeklyLikeCnt = weeklyLikeCnt;
        this.monthlyLikeCnt = monthlyLikeCnt;
        this.dailyLikeUpdatedAt = dailyLikeUpdatedAt;
        this.weeklyLikeUpdatedAt = weeklyLikeUpdatedAt;
        this.monthlyLikeUpdatedAt = monthlyLikeUpdatedAt;
        this.photo = photo;
    }

    public static PhotoDetail init(Photo photo) {
        return builder()
                .commentCnt(0)
                .likeCnt(0)
                .viewCnt(0)
                .dailyLikeCnt(0)
                .weeklyLikeCnt(0)
                .monthlyLikeCnt(0)
                .dailyLikeUpdatedAt(LocalDateTime.now())
                .weeklyLikeUpdatedAt(LocalDateTime.now())
                .monthlyLikeUpdatedAt(LocalDateTime.now())
                .photo(photo)
                .build();
    }

    public void updateLikeCnt(boolean operation) {
        if (operation) {
            this.likeCnt++;
            this.dailyLikeCnt++;
            this.weeklyLikeCnt++;
            this.monthlyLikeCnt++;

            this.dailyLikeUpdatedAt = LocalDateTime.now();
            this.weeklyLikeUpdatedAt = LocalDateTime.now();
            this.monthlyLikeUpdatedAt = LocalDateTime.now();
        } else {
            this.likeCnt--;
            this.dailyLikeCnt--;
            this.weeklyLikeCnt--;
            this.monthlyLikeCnt--;
        }
    }

    public Integer updateCommentCnt(boolean operation) {
        if (operation) {
            this.commentCnt++;
        } else {
            this.commentCnt--;
        }
        return commentCnt;
    }

    public void updateViewCnt(boolean operation) {
        if (operation) {
            this.viewCnt++;
        } else {
            this.viewCnt--;
        }
    }

    public void resetDailyLikeCnt(LocalDateTime localDateTime) {
        this.dailyLikeCnt = 0;
        this.dailyLikeUpdatedAt = localDateTime;
    }

    public void resetWeeklyLikeCnt(LocalDateTime localDateTime) {
        this.weeklyLikeCnt = 0;
        this.weeklyLikeUpdatedAt = localDateTime;
    }

    public void resetMonthlyLikeCnt(LocalDateTime localDateTime) {
        this.monthlyLikeCnt = 0;
        this.monthlyLikeUpdatedAt = localDateTime;
    }

}
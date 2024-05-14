package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyPhotoRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer dailyRanking;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private DailyPhotoRanking(Integer dailyRanking, Photo photo) {
        this.dailyRanking = dailyRanking;
        this.photo = photo;
    }

    public DailyPhotoRanking of(Integer dailyRanking, Photo photo) {
        return builder()
                .dailyRanking(dailyRanking)
                .photo(photo)
                .build();
    }

}
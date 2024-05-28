package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WeeklyPhotoRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer weeklyRanking;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private WeeklyPhotoRanking(Integer weeklyRanking, Photo photo) {
        this.weeklyRanking = weeklyRanking;
        this.photo = photo;
    }

    public static WeeklyPhotoRanking of(Integer weeklyRanking, Photo photo) {
        return builder()
                .weeklyRanking(weeklyRanking)
                .photo(photo)
                .build();
    }

}
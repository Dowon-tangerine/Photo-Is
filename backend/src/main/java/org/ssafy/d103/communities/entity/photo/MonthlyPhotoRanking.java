package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MonthlyPhotoRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer monthlyRanking;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private MonthlyPhotoRanking(Integer monthlyRanking, Photo photo) {
        this.monthlyRanking = monthlyRanking;
        this.photo = photo;
    }

    public static MonthlyPhotoRanking of(Integer monthlyRanking, Photo photo) {
        return builder()
                .monthlyRanking(monthlyRanking)
                .photo(photo)
                .build();
    }

}
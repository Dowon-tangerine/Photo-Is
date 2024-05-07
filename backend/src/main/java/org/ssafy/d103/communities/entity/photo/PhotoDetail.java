package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

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

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private PhotoDetail(Integer likeCnt, Integer commentCnt, Integer viewCnt, Photo photo) {
        this.likeCnt = likeCnt;
        this.commentCnt = commentCnt;
        this.viewCnt = viewCnt;
        this.photo = photo;
    }

    static public PhotoDetail init(Photo photo) {
        return builder()
                .commentCnt(0)
                .likeCnt(0)
                .viewCnt(0)
                .photo(photo)
                .build();
    }
}
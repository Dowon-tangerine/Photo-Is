package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
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

}
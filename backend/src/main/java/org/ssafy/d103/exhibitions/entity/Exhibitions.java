package org.ssafy.d103.exhibitions.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Exhibitions extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exhibition_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Members memberId;

    @Column(name = "poster_url", nullable = false)
    private String posterUrl;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "like_cnt", nullable = false)
    private int likeCnt;

    @Builder
    private Exhibitions(Long id, Members memberId, String posterUrl, String title, String description, LocalDateTime endDate, int likeCnt) {
        this.id = id;
        this.memberId = memberId;
        this.posterUrl = posterUrl;
        this.title = title;
        this.description = description;
        this.endDate = endDate;
        this.likeCnt = likeCnt;
    }
}

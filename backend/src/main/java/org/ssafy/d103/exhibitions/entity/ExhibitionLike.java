package org.ssafy.d103.exhibitions.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;

@Entity
@Getter
@NoArgsConstructor
public class ExhibitionLike extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exhibition_id", nullable = false)
    Exhibitions exhibitionId;

    @Builder
    private ExhibitionLike(Long id, Exhibitions exhibitionId) {
        this.id = id;
        this.exhibitionId = exhibitionId;
    }
}

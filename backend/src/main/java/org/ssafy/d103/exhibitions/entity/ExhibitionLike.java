package org.ssafy.d103.exhibitions.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

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

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    Members memberId;

    @Builder
    private ExhibitionLike(Long id, Exhibitions exhibitionId, Members memberId) {
        this.id = id;
        this.exhibitionId = exhibitionId;
        this.memberId = memberId;
    }
}

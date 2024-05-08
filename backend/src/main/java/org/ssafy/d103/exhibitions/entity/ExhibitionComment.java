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
public class ExhibitionComment extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exhibition_id", nullable = false)
    private Exhibitions exhibitionId;

    @ManyToOne
    @JoinColumn(referencedColumnName = "member_id", name = "member_id", nullable = false)
    private Members memberId;

    @Column
    private String comment;

    @Builder
    private ExhibitionComment(Long id, Exhibitions exhibitionId, Members memberId, String comment) {
        this.id = id;
        this.exhibitionId = exhibitionId;
        this.memberId = memberId;
        this.comment = comment;
    }
}

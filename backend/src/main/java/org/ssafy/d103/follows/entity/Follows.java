package org.ssafy.d103.follows.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

@Entity
@Getter
@NoArgsConstructor
public class Follows extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "follow_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private Members followerId;

    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private Members followingId;

    @Builder
    private Follows(Long id, Members followerId, Members followingId) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
    }

    public Follows of(Members followerId, Members followingId) {
        return builder()
                .followerId(followerId)
                .followingId(followingId)
                .build();
    }
}

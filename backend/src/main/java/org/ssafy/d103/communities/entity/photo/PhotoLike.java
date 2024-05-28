package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhotoLike extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_like_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @ManyToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private PhotoLike(Members member, Photo photo) {
        this.member = member;
        this.photo = photo;
    }

    public static PhotoLike of(Members member, Photo photo) {
        return builder()
                .member(member)
                .photo(photo)
                .build();
    }

}
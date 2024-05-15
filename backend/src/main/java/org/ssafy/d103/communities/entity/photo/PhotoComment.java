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
public class PhotoComment extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_comment_id")
    private Long id;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @ManyToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    private PhotoComment(String comment, Members member, Photo photo) {
        this.comment = comment;
        this.member = member;
        this.photo = photo;
    }

    public static PhotoComment of(String comment, Members member, Photo photo) {
        return builder()
                .comment(comment)
                .member(member)
                .photo(photo)
                .build();
    }

}
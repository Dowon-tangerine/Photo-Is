package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.members.entity.Members;

import java.util.List;

@Entity
public class Photo extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String thumbnailUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessType accessType;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Metadata metadata;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private PhotoDetail photoDetail;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Question question;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoLike> photoLikeList;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoComment> photoCommentList;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoHashtag> photoHashtagList;

}
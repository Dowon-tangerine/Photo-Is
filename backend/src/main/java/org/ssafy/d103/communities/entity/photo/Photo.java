package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.communities.dto.photo.request.PutModifyPhotoRequest;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.members.entity.Members;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    private PhotoMetadata photoMetadata;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private PhotoDetail photoDetail;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private DailyPhotoRanking dailyPhotoRanking;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private WeeklyPhotoRanking weeklyPhotoRanking;

    @OneToOne(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private MonthlyPhotoRanking monthlyPhotoRanking;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Question> question;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoLike> photoLikeList;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoComment> photoCommentList;

    @OneToMany(mappedBy = "photo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoHashtag> photoHashtagList;

    @Builder
    private Photo(String title, String imageUrl, String thumbnailUrl, AccessType accessType, Members member) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.accessType = accessType;
        this.member = member;
    }

    public static Photo of(String title, String imageUrl, String thumbnailUrl, AccessType accessType, Members member) {
        return builder()
                .title(title)
                .imageUrl(imageUrl)
                .thumbnailUrl(thumbnailUrl)
                .accessType(accessType)
                .member(member)
                .build();
    }

    public void modifyPhoto(PutModifyPhotoRequest putModifyPhotoRequest) {
        this.title = putModifyPhotoRequest.getTitle();
        this.accessType = AccessType.fromString(putModifyPhotoRequest.getAccessType());
    }

}
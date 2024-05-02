package org.ssafy.d103.members.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.ssafy.d103._common.entity.CreatedAndDeletedTime;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoComment;
import org.ssafy.d103.communities.entity.photo.PhotoLike;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionComment;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE members set deleted_at = CONVERT_TZ(NOW(), 'UTC', 'Asia/Seoul') WHERE id = ?")
public class Members extends CreatedAndDeletedTime {

    public enum Camera {
        FUJI, CANON, NIKON, SONY
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "birth_year", nullable = false)
    private int birthYear;

    @Column
    @Enumerated
    private Camera camera;

    @Column(name = "use_year", nullable = false)
    private int useYear;

    @Column(name = "profile_url", nullable = false)
    private String profileUrl;

    @Column(name = "background_url", nullable = false)
    private String backgroundUrl;

    @Column
    private String introduction;

    @Column
    private String country;

    @Column
    private String city;

    @Column(name = "photo_cnt", nullable = false)
    private int photoCnt;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Photo> photoList;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoLike> photoLikeList;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoComment> photoCommentList;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Question> questionList;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<QuestionComment> questionCommentList;

    @Builder
    public Members(
            String email, String password, String nickname, int birthYear,
            Camera camera, int useYear, String profileUrl, String backgroundUrl, String introduction,
            String country, String city, int photoCnt
    ) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.birthYear = birthYear;
        this.camera = camera;
        this.useYear = useYear;
        this.profileUrl = profileUrl;
        this.backgroundUrl = backgroundUrl;
        this.introduction = introduction;
        this.country = country;
        this.city = city;
        this.photoCnt = photoCnt;
    }

    public static Members of(String email, String password, String nickname, int birthYear, int useYear) {
        return builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .birthYear(birthYear)
                .camera(Camera.FUJI)
                .useYear(useYear)
                .profileUrl("testUrl")
                .backgroundUrl("testUrl")
                .introduction("자기소개가 없습니다.")
                .build();
    }

    public void updateAllInfo(String nickname, int birthYear, int useYear, Camera camera, String profileUrl, String country, String city){
        this.nickname = nickname;
        this.birthYear = birthYear;
        this.useYear = useYear;
        this.camera = camera;
        this.profileUrl = profileUrl;
        this.country = country;
        this.city = city;
    }

    public void updatePhotoCnt(int photoCnt) {
        this.photoCnt = photoCnt;
    }
}

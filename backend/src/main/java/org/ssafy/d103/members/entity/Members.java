package org.ssafy.d103.members.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @JsonIgnore
    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Photo> photoList;

    @JsonIgnore
    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoLike> photoLikeList;

    @JsonIgnore
    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoComment> photoCommentList;

    @JsonIgnore
    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Question> questionList;

    @JsonIgnore
    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<QuestionComment> questionCommentList;

    @Column(name = "follower_cnt", nullable = false)
    private int followerCnt;

    @Column(name = "following_cnt", nullable = false)
    private int followingCnt;

    @Builder
    public Members(
            String email, String password, String nickname, int birthYear,
            Camera camera, int useYear, String profileUrl, String backgroundUrl, String introduction,
            String country, String city, int photoCnt, int followerCnt, int followingCnt
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
        this.followerCnt = followerCnt;
        this.followingCnt = followingCnt;
    }

    public static Members of(String email, String password, String nickname, String profileUrl, String backgroundUrl, int birthYear, int useYear) {
        return builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .birthYear(birthYear)
                .camera(Camera.FUJI)
                .useYear(useYear)
                .profileUrl(profileUrl)
                .backgroundUrl(backgroundUrl)
                .introduction("자기소개가 없습니다.")
                .followerCnt(0)
                .followingCnt(0)
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

    public void updateFollowCnt(int followerCnt, int followingCnt) { this.followerCnt = followerCnt; this.followingCnt = followingCnt; }

    public void hasPassword(PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(this.password);
    }

    public boolean checkPassword(String plainPassword, PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(plainPassword, this.password);
    }

    public void updateBackgroundImg(String backgroundUrl) {
        this.backgroundUrl = backgroundUrl;
    }
}

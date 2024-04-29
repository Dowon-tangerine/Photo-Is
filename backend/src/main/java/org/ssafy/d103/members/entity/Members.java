package org.ssafy.d103.members.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.ssafy.d103._common.entity.CreatedAndDeletedTime;

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
    private Integer birthYear;

    @Column
    @Enumerated
    private Camera camera;

    @Column(name = "use_year", nullable = false)
    private Integer useYear;

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
    private Integer photoCnt;

}

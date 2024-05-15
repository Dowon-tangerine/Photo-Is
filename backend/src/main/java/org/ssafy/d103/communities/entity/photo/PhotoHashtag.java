package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhotoHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_hashtag_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @ManyToOne
    @JoinColumn(name = "hashtag_id")
    private Hashtag hashtag;

    @Builder
    private PhotoHashtag(Photo photo, Hashtag hashtag) {
        this.photo = photo;
        this.hashtag = hashtag;
    }

    public static PhotoHashtag of(Photo photo, Hashtag hashtag) {
        return builder()
                .photo(photo)
                .hashtag(hashtag)
                .build();
    }

}
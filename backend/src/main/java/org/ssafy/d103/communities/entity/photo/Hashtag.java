package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hashtag_id")
    private Long id;

    @Column(nullable = false)
    private String tagText;

    @OneToMany(mappedBy = "hashtag", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoHashtag> photoHashtagList;

    @Builder
    private Hashtag(String tagText) {
        this.tagText = tagText;
    }

    public static Hashtag of(String tagText) {
        return builder()
                .tagText(tagText)
                .build();
    }

}
package org.ssafy.d103.exhibitions.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103.communities.entity.photo.Photo;

@Entity
@Getter
@NoArgsConstructor
public class ExhibitionPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exhibition_id", nullable = false)
    private Exhibitions exhibitionId;

    @OneToOne
    @JoinColumn(referencedColumnName = "photo_id", name = "photo_id", nullable = false)
    private Photo photoId;

    @Column(nullable = false)
    private int number;

    @Builder
    private ExhibitionPhoto(Long id, Exhibitions exhibitionId, Photo photoId, int number) {
        this.id = id;
        this.exhibitionId = exhibitionId;
        this.photoId = photoId;
        this.number = number;
    }

    public static ExhibitionPhoto of(Exhibitions exhibition, Photo photoId, int number) {
        return builder()
                .exhibitionId(exhibition)
                .photoId(photoId)
                .number(number)
                .build();
    }
}

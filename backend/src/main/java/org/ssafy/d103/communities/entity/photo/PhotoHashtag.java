package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;

@Entity
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

}
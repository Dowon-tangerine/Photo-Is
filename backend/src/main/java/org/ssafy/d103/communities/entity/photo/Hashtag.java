package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hashtag_id")
    private Long id;

    @Column(nullable = false)
    private String tagText;

    @OneToMany(mappedBy = "hashtag", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<PhotoHashtag> photoHashtagList;

}
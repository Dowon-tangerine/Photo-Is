package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

@Entity
public class PhotoComment extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "photo_comment_id")
    private Long id;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @ManyToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

}
package org.ssafy.d103.communities.entity.question;

import jakarta.persistence.*;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.members.entity.Members;

import java.util.List;

@Entity
public class Question extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @OneToOne(mappedBy = "question", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private QuestionDetail questionDetail;

    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<QuestionComment> questionCommentList;

}
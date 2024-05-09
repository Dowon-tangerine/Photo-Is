package org.ssafy.d103.communities.entity.question;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.members.entity.Members;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @Builder
    private Question(String title, String content, Category category, Members member, Photo photo) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.member = member;
        this.photo = photo;
    }

    public static Question of(String title, String content, Category category, Members member, Photo photo) {
        return builder()
                .title(title)
                .content(content)
                .category(category)
                .member(member)
                .photo(photo)
                .build();
    }

    public static Question of(String title, String content, Category category, Members member) {
        return builder()
                .title(title)
                .content(content)
                .category(category)
                .member(member)
                .build();
    }

    public Question modifyQuestion(String title, String content) {
        this.title = title;
        this.content = content;

        return this;
    }

}
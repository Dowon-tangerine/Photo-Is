package org.ssafy.d103.communities.entity.question;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.OnlyCreatedTime;
import org.ssafy.d103.members.entity.Members;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuestionComment extends OnlyCreatedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_comment_id")
    private Long id;

    @Column(nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Builder
    private QuestionComment(String comment, Members member, Question question) {
        this.comment = comment;
        this.member = member;
        this.question = question;
    }

    public static QuestionComment of(String comment, Members member, Question question) {
        return builder()
                .comment(comment)
                .member(member)
                .question(question)
                .build();
    }

}
package org.ssafy.d103.communities.entity.question;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuestionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_detail_id")
    private Long id;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer commentCnt;

    @Column(nullable = false)
    @ColumnDefault("0")
    private Integer viewCnt;

    @OneToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @Builder
    private QuestionDetail(Integer commentCnt, Integer viewCnt, Question question) {
        this.commentCnt = commentCnt;
        this.viewCnt = viewCnt;
        this.question = question;
    }

    public static QuestionDetail init(Question question) {
        return builder()
                .commentCnt(0)
                .viewCnt(0)
                .question(question)
                .build();
    }

}
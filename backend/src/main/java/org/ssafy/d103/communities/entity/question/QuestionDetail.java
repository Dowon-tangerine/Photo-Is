package org.ssafy.d103.communities.entity.question;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

@Entity
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

}
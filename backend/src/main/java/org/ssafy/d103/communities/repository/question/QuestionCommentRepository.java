package org.ssafy.d103.communities.repository.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionComment;

import java.util.List;

@Repository
public interface QuestionCommentRepository extends JpaRepository<QuestionComment, Long> {

    List<QuestionComment> findAllByQuestion(Question question);

}
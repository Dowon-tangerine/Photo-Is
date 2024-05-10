package org.ssafy.d103.communities.repository.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionDetail;

import java.util.Optional;

@Repository
public interface QuestionDetailRepository extends JpaRepository<QuestionDetail, Long> {

    Optional<QuestionDetail> findByQuestion(Question question);

}
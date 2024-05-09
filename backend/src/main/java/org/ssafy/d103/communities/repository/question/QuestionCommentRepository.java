package org.ssafy.d103.communities.repository.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionComment;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionCommentRepository extends JpaRepository<QuestionComment, Long> {

    List<QuestionComment> findAllByQuestion(Question question);

    Optional<QuestionComment> findByIdAndQuestionAndMember(Long id, Question question, Members member);

}
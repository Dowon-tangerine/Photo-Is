package org.ssafy.d103.communities.repository.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.members.entity.Members;

import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findQuestionByIdAndMember(Long id, Members member);

}
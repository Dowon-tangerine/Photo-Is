package org.ssafy.d103.communities.repository.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.question.QuestionDetail;

@Repository
public interface QuestionDetailRepository extends JpaRepository<QuestionDetail, Long> {



}
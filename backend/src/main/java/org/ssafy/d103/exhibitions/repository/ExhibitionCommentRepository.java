package org.ssafy.d103.exhibitions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.exhibitions.entity.ExhibitionComment;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExhibitionCommentRepository extends JpaRepository<ExhibitionComment, Long> {

    Optional<List<ExhibitionComment>> findAllByExhibitionId(Exhibitions exhibition);

    Optional<ExhibitionComment> findExhibitionCommentByExhibitionId(Exhibitions exhibition);
}

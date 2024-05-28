package org.ssafy.d103.exhibitions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.exhibitions.entity.ExhibitionLike;
import org.ssafy.d103.exhibitions.entity.Exhibitions;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExhibitionLikeRepository extends JpaRepository<ExhibitionLike, Long> {

    Optional<ExhibitionLike> findAllByMemberIdAndExhibitionId(Members member, Exhibitions exhibition);

    Optional<List<ExhibitionLike>> findAllByMemberId(Members member);
}

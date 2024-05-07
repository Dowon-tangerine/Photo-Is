package org.ssafy.d103.follows.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.follows.entity.Follows;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follows, Long> {

    Optional<Follows> findAllByFollowerIdAndFollowingId(Members follower, Members following);

    Optional<List<Follows>> findFollowsByFollowingId(Members member);

    Optional<List<Follows>> findFollowsByFollowerId(Members member);
}

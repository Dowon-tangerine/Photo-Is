package org.ssafy.d103.exhibitions.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.exhibitions.entity.Exhibitions;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibitions, Long> {

    @Query(value =
            "SELECT * " +
                    "FROM exhibitions " +
                    "WHERE end_date >= NOW() " +
                    "AND member_id = :memberId", nativeQuery = true)
    Optional<List<Exhibitions>> findCurrentExhibitionsByMemberId(@Param("memberId") Long memberId);

    @Query(value =
            "SELECT * " +
                    "FROM exhibitions " +
                    "WHERE end_date < NOW() " +
                    "AND member_id = :memberId", nativeQuery = true)
    Optional<List<Exhibitions>> findClosedExhibitionsByMemberId(@Param("memberId") Long memberId);

    @Query(value =
            "SELECT * " +
            "FROM exhibitions " +
            "WHERE end_date >= NOW() " +
            "AND member_id = :memberId", nativeQuery = true)
    Optional<List<Exhibitions>> findAllByMemberId(@Param("memberId") Long memberId);
}

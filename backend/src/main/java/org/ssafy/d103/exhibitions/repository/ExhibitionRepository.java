package org.ssafy.d103.exhibitions.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.util.Optional;

@Repository
public interface ExhibitionRepository extends JpaRepository<Exhibitions, Long> {

    @Query(value = "SELECT * " +
                    "FROM exhibitions ",
            nativeQuery = true)
    Optional<Page<Exhibitions>> findAllExhibitions(Pageable pageable);
}

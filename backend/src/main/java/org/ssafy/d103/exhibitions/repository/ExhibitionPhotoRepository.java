package org.ssafy.d103.exhibitions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;

@Repository
public interface ExhibitionPhotoRepository extends JpaRepository<ExhibitionPhoto, Long> {
}

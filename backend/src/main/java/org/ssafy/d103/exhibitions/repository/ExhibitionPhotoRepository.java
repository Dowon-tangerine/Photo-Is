package org.ssafy.d103.exhibitions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExhibitionPhotoRepository extends JpaRepository<ExhibitionPhoto, Long> {

    Optional<List<ExhibitionPhoto>> findAllByExhibitionId(Exhibitions exhibition);

    List<ExhibitionPhoto> findByPhotoId(Photo photoId);
}

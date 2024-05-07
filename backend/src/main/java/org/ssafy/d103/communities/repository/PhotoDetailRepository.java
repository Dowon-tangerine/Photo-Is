package org.ssafy.d103.communities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;

import java.util.Optional;

@Repository
public interface PhotoDetailRepository extends JpaRepository<PhotoDetail, Long> {

    Optional<PhotoDetail> findPhotoDetailByPhoto(Photo photo);

}
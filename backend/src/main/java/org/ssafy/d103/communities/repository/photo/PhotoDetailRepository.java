package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.AccessType;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoDetailRepository extends JpaRepository<PhotoDetail, Long> {

    Optional<PhotoDetail> findPhotoDetailByPhoto(Photo photo);

    @Query("SELECT pd FROM PhotoDetail pd JOIN pd.photo p WHERE p.accessType = :accessType")
    List<PhotoDetail> findAllByPhotoAccessType(@Param("accessType") AccessType accessType);

}
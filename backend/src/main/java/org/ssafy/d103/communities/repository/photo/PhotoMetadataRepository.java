package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;

import java.util.Optional;

@Repository
public interface PhotoMetadataRepository extends JpaRepository<PhotoMetadata, Long> {

    Optional<PhotoMetadata> findPhotoMetadataByPhoto(Photo photo);

}
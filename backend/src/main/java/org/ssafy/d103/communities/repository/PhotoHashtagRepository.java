package org.ssafy.d103.communities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoHashtag;

import java.util.List;

@Repository
public interface PhotoHashtagRepository extends JpaRepository<PhotoHashtag, Long> {

    void deletePhotoHashtagByPhoto(Photo photo);

    List<PhotoHashtag> findAllByPhoto(Photo photo);

}
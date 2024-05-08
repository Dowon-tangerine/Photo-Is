package org.ssafy.d103.communities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoComment;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoCommentRepository extends JpaRepository<PhotoComment, Long> {

    List<PhotoComment> findAllByPhoto(Photo photo);

    Optional<PhotoComment> findPhotoCommentByIdAndPhotoAndMember(Long id, Photo photo, Members member);

}
package org.ssafy.d103.communities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoComment;

import java.util.List;

@Repository
public interface PhotoCommentRepository extends JpaRepository<PhotoComment, Long> {

    List<PhotoComment> findAllByPhoto(Photo photo);

}
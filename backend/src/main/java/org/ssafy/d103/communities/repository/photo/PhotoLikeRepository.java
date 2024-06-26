package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoLike;
import org.ssafy.d103.members.entity.Members;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoLikeRepository extends JpaRepository<PhotoLike, Long> {

    List<PhotoLike> findAllByMember(Members member);

    Optional<PhotoLike> findPhotoLikeByMemberAndPhoto(Members member, Photo photo);

    int countByPhotoAndCreatedAtBetween(Photo photo, LocalDateTime startDateTime, LocalDateTime endDateTime);

}
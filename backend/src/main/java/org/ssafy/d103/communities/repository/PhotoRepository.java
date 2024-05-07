package org.ssafy.d103.communities.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.AccessType;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.members.entity.Members;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    Optional<Photo> findPhotoByIdAndMember(Long id, Members member);

    void deleteByIdAndMember(Long id, Members member);

    List<Photo> findAllByMemberAndAccessType(Members member, AccessType accessType);

    List<Photo> findAllByMemberOrderByCreatedAtDesc(Members member);

}
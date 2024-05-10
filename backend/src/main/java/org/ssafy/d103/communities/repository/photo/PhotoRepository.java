package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Optional<Photo> findPhotoById(Long id);

    void deleteByIdAndMember(Long id, Members member);

    Page<Photo> findAllByMemberAndAccessTypeOrderByCreatedAtDesc(Members member, AccessType accessType, Pageable pageable);

    Page<Photo> findAllByMemberOrderByCreatedAtDesc(Members member, Pageable pageable);

    Page<Photo> findAllByAccessType(AccessType accessType, Pageable pageable);

    Page<Photo> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title, Pageable pageable);

    Page<Photo> findByIdInOrderByCreatedAtDesc(List<Long> photoIds, Pageable pageable);

    int countByMember(Members member);

}
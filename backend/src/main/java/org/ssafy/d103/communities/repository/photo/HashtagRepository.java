package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.Hashtag;

import java.util.List;
import java.util.Optional;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, Long> {

    Optional<Hashtag> findHashtagByTagText(String tagText);

    Optional<Hashtag> findHashtagById(Long id);

    @Query("SELECT p.photo.id FROM PhotoHashtag p WHERE p.hashtag.tagText LIKE %:tagText%")
    List<Long> findPhotosByHashtagText(@Param("tagText") String tagText);

}
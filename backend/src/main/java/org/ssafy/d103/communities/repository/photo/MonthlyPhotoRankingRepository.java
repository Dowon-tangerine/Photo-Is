package org.ssafy.d103.communities.repository.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.communities.entity.photo.MonthlyPhotoRanking;

@Repository
public interface MonthlyPhotoRankingRepository extends JpaRepository<MonthlyPhotoRanking, Long> {
}
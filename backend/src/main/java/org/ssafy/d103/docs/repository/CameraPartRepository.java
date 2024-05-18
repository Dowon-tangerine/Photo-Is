package org.ssafy.d103.docs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.docs.entity.CameraPart;

@Repository
public interface CameraPartRepository extends JpaRepository<CameraPart, Long> {
}
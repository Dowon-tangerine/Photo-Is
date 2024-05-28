package org.ssafy.d103.docs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.docs.entity.CameraPart;

import java.util.List;

@Repository
public interface CameraPartRepository extends JpaRepository<CameraPart, Long> {
    List<CameraPart> findByNameContaining(String name);
}
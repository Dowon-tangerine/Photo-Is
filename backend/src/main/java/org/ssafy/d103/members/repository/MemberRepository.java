package org.ssafy.d103.members.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.members.entity.Members;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Members, Long> {

    Optional<Members> findMembersByEmailAndDeletedAtIsNull(String email);

    Optional<Members> findMembersByEmailAndPasswordAndDeletedAtIsNull(String email, String password);

}

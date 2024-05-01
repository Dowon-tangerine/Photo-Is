package org.ssafy.d103.members.repository;

import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.d103.members.entity.Tokens;

@Repository
@EnableRedisRepositories
public interface TokenRepository extends CrudRepository<Tokens, String> {

}

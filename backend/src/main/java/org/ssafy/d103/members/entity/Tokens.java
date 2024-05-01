package org.ssafy.d103.members.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@AllArgsConstructor
@RedisHash(value = "jwtToken", timeToLive = 60*60*24*3)
public class Tokens {

    @Id
    private String id;

    private String refreshToken;

    @Indexed
    private String accessToken;
}

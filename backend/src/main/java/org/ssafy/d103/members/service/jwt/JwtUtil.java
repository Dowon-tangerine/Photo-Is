package org.ssafy.d103.members.service.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.service.UserDetailsServiceImpl;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final Environment env;

    private final UserDetailsServiceImpl userDetailsService;
    private static final String AUTHORIZATION_HEADER = "Authorization";

    private static final String BEARER_PREFIX = "Bearer ";

    @Value("${jwt.secret}")
    private String secretKey;
    private Key key;
    private final SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

    @PostConstruct
    public void init() {
        byte [] bytes = Base64.getDecoder().decode(secretKey);
        key = Keys.hmacShaKeyFor(bytes);
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public String createToken(Members member, boolean isRefreshToken) {
        int TOKEN_TIME = 0;
        if(isRefreshToken){
            TOKEN_TIME = Integer.parseInt(Objects.requireNonNull(env.getProperty("jwt.token.refresh-expiration-time")));
        } else {
            TOKEN_TIME = Integer.parseInt(Objects.requireNonNull(env.getProperty("jwt.token.access-expiration-time")));
        }
        Date now = new Date();

        return BEARER_PREFIX +
                Jwts.builder()
                        .setSubject(member.getEmail())
                        .setIssuedAt(new Date(now.getTime()))
                        .setExpiration(new Date(now.getTime() + TOKEN_TIME))
                        .signWith(key, signatureAlgorithm)
                        .compact();
    }

    public int validateToken(String token) {

        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return 1;
        } catch (io.jsonwebtoken.security.SignatureException | SecurityException | MalformedJwtException e) {
            log.error("유효하지 않은 JWT 입니다.");
            return -1;
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 입니다.");
            return -1;
        } catch (IllegalArgumentException e) {
            log.error("잘못된 JWT 토큰 입니다.");
            return -1;
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT token 입니다.");
            return -2;
        }
    }

    public Claims getUserInfoFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public Authentication createAuthentication(String userEmail) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}

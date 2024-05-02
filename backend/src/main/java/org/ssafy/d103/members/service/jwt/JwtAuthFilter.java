package org.ssafy.d103.members.service.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;
import org.ssafy.d103._common.exception.ErrorType;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = jwtUtil.resolveToken(request);

        if(token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        int validationCheck = jwtUtil.validateToken(token);

        if(validationCheck < 0) {
            if(validationCheck == -1) {
                request.setAttribute("exception", ErrorType.INVALID_TOKEN.toString());
                filterChain.doFilter(request, response);
                return;
            } else if(validationCheck == -2) {
                request.setAttribute("exception", ErrorType.EXPIRED_TOKEN.toString());
            }
        }

        Claims info = jwtUtil.getUserInfoFromToken(token);
        log.info("토큰에 들어있는 값 = {}", info.toString());

        try {
            setAuthentication(info.getSubject());
        } catch (UsernameNotFoundException e) {
            request.setAttribute("exception", ErrorType.NOT_FOUND_MEMBER.toString());
        }
        filterChain.doFilter(request, response);
    }

    private void setAuthentication(String userEmail) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = jwtUtil.createAuthentication(userEmail);
        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);
    }
}

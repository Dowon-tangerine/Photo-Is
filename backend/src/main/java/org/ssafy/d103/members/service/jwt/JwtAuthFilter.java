package org.ssafy.d103.members.service.jwt;

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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.members.dto.SecurityMemberDto;
import org.ssafy.d103.members.entity.Members;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CommonService commonService;
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

        try {
            setAuthentication(jwtUtil.getMemberId(token));
        } catch (UsernameNotFoundException e) {
            request.setAttribute("exception", ErrorType.NOT_FOUND_MEMBER.toString());
        }
        filterChain.doFilter(request, response);
    }

    private void setAuthentication(Long memberId) {
        Members member = commonService.validateMemberByToken(memberId);
        SecurityMemberDto securityMemberDto = SecurityMemberDto.from(member);

        SecurityContext context = SecurityContextHolder.createEmptyContext();

        Authentication authentication = jwtUtil.getAuthentication(securityMemberDto);
        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);
        log.info("토큰에 들어있는 값 = {}", securityMemberDto);
    }
}

package org.ssafy.d103.members.service;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.dto.response.PostValidateMemberResponse;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.entity.Tokens;
import org.ssafy.d103.members.repository.MemberRepository;
import org.ssafy.d103.members.repository.TokenRepository;
import org.ssafy.d103.members.service.jwt.JwtUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final TokenRepository tokenRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public String saveMember(PostAddMemberRequest request) {

        Members member = memberRepository.findMembersByEmailAndDeletedAtIsNull(request.getEmail())
                .orElse(null);

        // 이미 가입한 사용자
        if(member != null) {
            throw new CustomException(ErrorType.DUPLICATED_MEMBER);
        }

        // 처음 가입한 사용자
        memberRepository.save(
                Members.of(
                        request.getEmail(),
                        request.getPassword(),
                        request.getNickname(),
                        request.getBirthYear(),
                        request.getUseYear()
                )
        );

        return null;
    }

    public PostValidateMemberResponse validateMember(PostValidateMemberRequest request, HttpServletResponse response) {

        Members member = memberRepository.findMembersByEmailAndPasswordAndDeletedAtIsNull(request.getEmail(), request.getPassword())
                .orElse(null);

        if(member == null) {
            throw new CustomException(ErrorType.NOT_FOUND_MEMBER);
        }

        String jwtAccessToken = jwtUtil.createToken(member, false);
        String jwtRefreshToken = jwtUtil.createToken(member, true);
        response.addHeader("Authorization", jwtAccessToken);

        tokenRepository.save(new Tokens(String.valueOf(member.getId()), jwtRefreshToken, jwtAccessToken));

        return PostValidateMemberResponse.from(member);
    }
}

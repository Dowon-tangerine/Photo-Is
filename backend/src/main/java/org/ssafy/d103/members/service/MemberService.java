package org.ssafy.d103.members.service;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostCheckPasswordRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.dto.response.PostCheckElementsResponse;
import org.ssafy.d103.members.dto.response.PostValidateMemberResponse;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;
import org.ssafy.d103.members.service.jwt.JwtUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final CommonService commonService;

    @Transactional
    public String saveMember(PostAddMemberRequest request) {

        Members member = memberRepository.findMembersByEmailAndDeletedAtIsNull(request.getEmail())
                .orElse(null);

        // 이미 가입한 사용자
        if(member != null) {
            throw new CustomException(ErrorType.DUPLICATED_MEMBER);
        }

        Members newMember = Members.of(
                request.getEmail(),
                request.getPassword(),
                request.getNickname(),
                request.getBirthYear(),
                request.getUseYear()
        );

        // 비밀번호 암호화
        newMember.hasPassword(passwordEncoder);

        // 처음 가입한 사용자
        memberRepository.save(newMember);

        return null;
    }

    public PostValidateMemberResponse validateMember(PostValidateMemberRequest request, HttpServletResponse response) {

        Members member = memberRepository.findMembersByEmailAndDeletedAtIsNull(request.getEmail())
                .orElse(null);

        // 멤버가 존재하지 않을 때
        if(member == null) {
            throw new CustomException(ErrorType.NOT_FOUND_MEMBER);
        }

        // 멤버의 비밀번호를 비교 후 일치하면 토큰 생성
        if(member.checkPassword(request.getPassword(), passwordEncoder)) {
            String jwtAccessToken = jwtUtil.createToken(member, false);
            String jwtRefreshToken = jwtUtil.createToken(member, true);
            response.addHeader("Authorization", jwtAccessToken);

            return PostValidateMemberResponse.from(member);
        }
        throw new CustomException(ErrorType.INVALID_PASSWORD);
    }

    public PostCheckElementsResponse checkNickname(String nickname) {

        if(memberRepository.findMembersByNicknameAndDeletedAtIsNull(nickname).isEmpty()){
            return new PostCheckElementsResponse(true);
        }
        throw new CustomException(ErrorType.DUPLICATED_NICKNAME);
    }

    public PostCheckElementsResponse checkEmail(String email) {

        if(memberRepository.findMembersByEmailAndDeletedAtIsNull(email).isEmpty()){
            return new PostCheckElementsResponse(true);
        }
        throw new CustomException(ErrorType.DUPLICATED_EMAIL);
    }

    public PostCheckElementsResponse checkPassword(Authentication authentication, PostCheckPasswordRequest request) {

        Members member = commonService.findMemberByAuthentication(authentication);
        if((member.checkPassword(request.getPassword(), passwordEncoder))) {
            return new PostCheckElementsResponse(true);
        }
        throw new CustomException(ErrorType.INVALID_PASSWORD);
    }

}

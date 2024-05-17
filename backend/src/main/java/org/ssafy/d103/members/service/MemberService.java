package org.ssafy.d103.members.service;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103._common.service.S3Uploader;
import org.ssafy.d103.follows.entity.Follows;
import org.ssafy.d103.follows.repository.FollowRepository;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostCheckPasswordRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.dto.request.PutUpdateMemberRequest;
import org.ssafy.d103.members.dto.response.GetSelectMemberResponse;
import org.ssafy.d103.members.dto.response.PostCheckElementsResponse;
import org.ssafy.d103.members.dto.response.PostValidateMemberResponse;
import org.ssafy.d103.members.dto.response.PutUpdateMemberResponse;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;
import org.ssafy.d103.members.service.jwt.JwtUtil;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final CommonService commonService;
    private final S3Uploader s3Uploader;

    @Value("${dummy.photos.profile-url}")
    private String profileUrl;
    @Value("${dummy.photos.background-url}")
    private String backgroundUrl;

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
                profileUrl,
                backgroundUrl,
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

    public GetSelectMemberResponse selectMember(Authentication authentication, Long memberId) {

        Members member = commonService.findMemberByAuthentication(authentication);
        Members target = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_MEMBER));
        List<Follows> followList = followRepository.findFollowsByFollowerId(member)
                .orElse(null);
        boolean isFollow = false;
        for(Follows f :followList){
            if(f.getFollowingId().getId() == target.getId()){
                isFollow = true;
            }
        }

        return GetSelectMemberResponse.from(target, isFollow);
    }

    public Page<MemberRepository.MemberDtoMapping> selectMemberList(Authentication authentication, String nickname, Pageable pageable) {

        Members member = commonService.findMemberByAuthentication(authentication);

        return memberRepository.findAllByMemberIdAndNickname(member.getId(), nickname, pageable)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_MEMBER));
    }

    @Transactional
    public PutUpdateMemberResponse updateMember(Authentication authentication, MultipartFile multipartFile, PutUpdateMemberRequest request) throws IOException {

        Members member = commonService.findMemberByAuthentication(authentication);
        String photoUrl = null;
        if(multipartFile != null) {
            photoUrl = s3Uploader.upload(multipartFile, "profile");
        }

        member.updateAllInfo(
                request.getNickname(),
                request.getBirthYear(),
                request.getUseYear(),
                request.getCamera(),
                photoUrl != null ? photoUrl : member.getProfileUrl(),
                request.getCountry(),
                request.getCity()
        );

        memberRepository.save(member);

        return PutUpdateMemberResponse.from(member);
    }

    @Transactional
    public String updateBackgroundImg(Authentication authentication, MultipartFile multipartFile) throws IOException{

        Members member = commonService.findMemberByAuthentication(authentication);
        String backgroundUrl = s3Uploader.upload(multipartFile, "background");
        member.updateBackgroundImg(backgroundUrl);
        memberRepository.save(member);
        return backgroundUrl;
    }
}

package org.ssafy.d103.members.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostCheckPasswordRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.dto.request.PutUpdateMemberRequest;
import org.ssafy.d103.members.service.MemberService;

import java.io.IOException;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    /**
     * 회원가입 API
     */
    @Operation(summary = "회원 가입 요청")
    @PostMapping("/")
    public ApiResponseDto<?> addMember(@RequestBody PostAddMemberRequest request) {
        return ResponseUtils.ok(memberService.saveMember(request), MsgType.SIGNUP_SUCCESSFULLY);
    }

    /**
     * 로그인 API
     */
    @Operation(summary = "로그인 요청")
    @PostMapping("/login")
    public ApiResponseDto<?> validateMember(@RequestBody PostValidateMemberRequest request, HttpServletResponse response) {
        return ResponseUtils.ok(memberService.validateMember(request, response), MsgType.SIGN_IN_SUCCESSFULLY);
    }

    /**
     * 닉네임 중복검사 API
     */
    @Operation(summary = "닉네임 중복검사 요청")
    @GetMapping("/check-nickname/{nickname}")
    public ApiResponseDto<?> checkNickname(@PathVariable String nickname){
         return ResponseUtils.ok(memberService.checkNickname(nickname), MsgType.VALIDATE_NICKNAME_SUCCESSFULLY);
    }

    /**
     * 이메일 중복검사 API
     */
    @Operation(summary = "이메일 중복검사 요청")
    @GetMapping("/check-email/{email}")
    public ApiResponseDto<?> checkEmail(@PathVariable String email){
        return ResponseUtils.ok(memberService.checkEmail(email), MsgType.VALIDATE_EMAIL_SUCCESSFULLY);
    }

    /**
     * 비밀번호 확인 API
     */
    @Operation(summary = "비밀번호 확인 요청")
    @PostMapping("/check-password")
    public ApiResponseDto<?> checkPassword(Authentication authentication, @RequestBody PostCheckPasswordRequest request) {
        return ResponseUtils.ok(memberService.checkPassword(authentication, request), MsgType.VALIDATE_PASSWORD_SUCCESSFULLY);
    }

    /**
     * 멤버 프로필 조회 API
     */
    @Operation(summary = "멤버 프로필 조회 요청")
    @GetMapping("/profile/{member-id}")
    public ApiResponseDto<?> selectMember(Authentication authentication, @PathVariable("member-id") Long memberId) {
        return ResponseUtils.ok(memberService.selectMember(authentication, memberId), MsgType.SELECT_MEMBER_SUCCESSFULLY);
    }

    /**
     * 닉네임 검색 API
     */
    @Operation(summary = "닉네임 검색 요청")
    @GetMapping("/nickname/{nickname}")
    public ApiResponseDto<?> selectMemberList(Authentication authentication, @PathVariable String nickname, Pageable pageable) {
        return ResponseUtils.ok(memberService.selectMemberList(authentication, nickname, pageable), MsgType.SELECT_MEMBER_LIST_SUCCESSFULLY);
    }

    /**
     * 회원정보 수정 API
     */
    @Operation(summary = "회원정보 수정 요청")
    @PutMapping("/")
    public ApiResponseDto<?> updateMember(Authentication authentication, @RequestPart(value = "memberInfo") PutUpdateMemberRequest request, @RequestPart(value = "photo", required = false) MultipartFile multipartFile) throws IOException {
        return ResponseUtils.ok(memberService.updateMember(authentication, multipartFile, request), MsgType.UPDATE_MEMBER_SUCCESSFULLY);
    }

    /**
     * 배경화면 수정 API
     */
    @Operation(summary = "배경화면 수정 요청")
    @PutMapping("/change-background")
    public ApiResponseDto<?> updateBackgroundImg(Authentication authentication, @RequestPart(value = "background") MultipartFile multipartFile) throws IOException {
        return ResponseUtils.ok(memberService.updateBackgroundImg(authentication, multipartFile), MsgType.UPDATE_BACKGROUND_IMG_SUCCESSFULLY);
    }
}

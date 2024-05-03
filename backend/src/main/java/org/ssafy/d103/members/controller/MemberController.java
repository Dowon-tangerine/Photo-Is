package org.ssafy.d103.members.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.service.MemberService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    /**
     * 회원가입 API
     */
    @PostMapping("/")
    public ApiResponseDto<?> addMember(@RequestBody PostAddMemberRequest request) {
        return ResponseUtils.ok(memberService.saveMember(request), MsgType.SIGNUP_SUCCESSFULLY);
    }

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ApiResponseDto<?> validateMember(@RequestBody PostValidateMemberRequest request, HttpServletResponse response) {
        return ResponseUtils.ok(memberService.validateMember(request, response), MsgType.SIGN_IN_SUCCESSFULLY);
    }

    /**
     * 닉네임 중복 검사 API
     */
    @GetMapping("/check-nickname/{nickname}")
    public ApiResponseDto<?> checkNickname(@PathVariable String nickname){
         return ResponseUtils.ok(memberService.checkNickname(nickname), MsgType.VALIDATE_NICKNAME_SUCCESSFULLY);
    }

    /**
     * 이메일 중복 검사 API
     */
    @GetMapping("/check-email/{email}")
    public ApiResponseDto<?> checkEmail(@PathVariable String email){
        return ResponseUtils.ok(memberService.checkEmail(email), MsgType.VALIDATE_EMAIL_SUCCESSFULLY);
    }
}

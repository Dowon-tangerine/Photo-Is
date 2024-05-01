package org.ssafy.d103.members.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.members.dto.request.PostAddMemberRequest;
import org.ssafy.d103.members.dto.request.PostValidateMemberRequest;
import org.ssafy.d103.members.service.MemberService;
import org.ssafy.d103.members.service.UserDetailsImpl;

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

    @GetMapping("/test")
    public void test(@AuthenticationPrincipal UserDetailsImpl userDetails){
         log.warn("정보: {}", userDetails.getMember().getNickname());
    }
}

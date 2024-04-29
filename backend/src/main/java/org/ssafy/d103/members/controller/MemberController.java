package org.ssafy.d103.members.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.members.dto.request.PostMemberRequest;
import org.ssafy.d103.members.service.MemberService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    /**
     * 회원가입 API
     */
    @PostMapping("/")
    public ApiResponseDto<?> addMember(@RequestBody PostMemberRequest request) {
        return ResponseUtils.ok(memberService.saveMember(request), MsgType.SIGNUP_SUCCESSFULLY);
    }
}

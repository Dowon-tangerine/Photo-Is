package org.ssafy.d103.follows.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.follows.service.FollowService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    /**
     * 유저 팔로우 API
     */
    @Operation(summary = "유저 팔로우 요청")
    @PostMapping("/follow/{member-id}")
    public ApiResponseDto<?> followMember(Authentication authentication, @PathVariable(name = "member-id") Long memberId) {
        return ResponseUtils.ok(followService.followMember(authentication, memberId), MsgType.UPDATE_FOLLOW_SUCCESSFULLY);
    }
}

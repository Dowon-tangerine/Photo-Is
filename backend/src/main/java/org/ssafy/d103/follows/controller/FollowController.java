package org.ssafy.d103.follows.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
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

    /**
     * 유저 언팔로우 API
     */
    @Operation(summary = "유저 언팔로우 요청")
    @DeleteMapping("/unfollow/{member-id}")
    public ApiResponseDto<?> unfollowMember(Authentication authentication, @PathVariable(name = "member-id") Long memberId) {
        return ResponseUtils.ok(followService.unfollowMember(authentication, memberId), MsgType.UPDATE_FOLLOW_SUCCESSFULLY);
    }
}

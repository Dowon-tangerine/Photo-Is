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

    /**
     * 팔로우 목록 조회 API
     */
    @Operation(summary = "팔로우 목록 조회 요청")
    @GetMapping("/following-list")
    public ApiResponseDto<?> selectFollowList(Authentication authentication) {
        return ResponseUtils.ok(followService.selectFollowList(authentication), MsgType.SELECT_FOLLOW_LIST_SUCCESSFULLY);
    }

    /**
     * 팔로워 목록 조회 API
     */
    @Operation(summary = "팔로워 목록 조회 요청")
    @GetMapping("/follower-list")
    public ApiResponseDto<?> selectFollowerList(Authentication authentication) {
        return ResponseUtils.ok(followService.selectFollowerList(authentication), MsgType.SELECT_FOLLOWER_LIST_SUCCESSFULLY);
    }
}

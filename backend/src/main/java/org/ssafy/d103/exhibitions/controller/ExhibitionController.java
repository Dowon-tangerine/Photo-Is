package org.ssafy.d103.exhibitions.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.exhibitions.dto.request.PostExhibitionCommentRequest;
import org.ssafy.d103.exhibitions.dto.request.PostInsertExhibitionRequest;
import org.ssafy.d103.exhibitions.dto.request.PutExhibitionLikeRequest;
import org.ssafy.d103.exhibitions.service.ExhibitionService;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exhibitions")
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    /**
     * 전시회 개회 API
     */
    @Operation(summary = "전시회 개회 요청")
    @PostMapping("/")
    public ApiResponseDto<?> insertExhibition(Authentication authentication, @RequestBody PostInsertExhibitionRequest request) {
        return ResponseUtils.ok(exhibitionService.insertExhibition(authentication, request), MsgType.INSERT_EXHIBITION_SUCCESSFULLY);
    }

    /**
     * 내 전시회 전체 목록 조회 API
     */
    @Operation(summary = "내 전시회 전체 목록 조회 요청")
    @GetMapping("/my")
    public ApiResponseDto<?> selectMyExhibitionList(Authentication authentication) {
        return ResponseUtils.ok(exhibitionService.selectMyExhibitionList(authentication), MsgType.SELECT_MY_EXHIBITION_LIST_SUCCESSFULLY);
    }

    /**
     * 전시회 상세정보 조회 API
     */
    @Operation(summary = "전시회 상세정보 조회 요청")
    @GetMapping("/{exhibition-id}")
    public ApiResponseDto<?> selectExhibition(@PathVariable(name = "exhibition-id") Long exhibitionId) {
        return ResponseUtils.ok(exhibitionService.selectExhibition(exhibitionId), MsgType.SELECT_EXHIBITION_SUCCESSFULLY);
    }

    /**
     * 전시회 한줄평 목록 조회 API
     */
    @Operation(summary = "전시회 한줄평 목록 조회 요청")
    @GetMapping("/comment/{exhibition-id}")
    public ApiResponseDto<?> selectExhibitionComment(@PathVariable(name = "exhibition-id") Long exhibitionId) {
        return ResponseUtils.ok(exhibitionService.selectExhibitionCommentList(exhibitionId), MsgType.SELECT_EXHIBITION_COMMENT_LIST_SUCCESSFULLY);
    }

    /**
     * 전시회 사진 목록 조회 API
     */
    @Operation(summary = "전시회 사진 목록 조회 요청")
    @GetMapping("/photos/{exhibition-id}")
    public ApiResponseDto<?> selectExhibitionPhotoList(@PathVariable(name = "exhibition-id") Long exhibitionId) {
        return ResponseUtils.ok(exhibitionService.selectExhibitionPhotoList(exhibitionId), MsgType.SELECT_EXHIBITION_PHOTO_LIST_SUCCESSFULLY);
    }

    /**
     * 전시회 좋아요 API
     */
    @Operation(summary = "전시회 좋아요 요청")
    @PutMapping("/change-like")
    public ApiResponseDto<?> updateExhibitionLike(Authentication authentication, @RequestBody PutExhibitionLikeRequest request) {
        return ResponseUtils.ok(exhibitionService.updateLike(authentication, request), MsgType.UPDATE_EXHIBITION_LIKE_SUCCESSFULLY);
    }

    /**
     * 전시회 한줄평 작성 API
     */
    @Operation(summary = "전시회 한줄평 작성 요청")
    @PostMapping("/comment")
    public ApiResponseDto<?> saveExhibitionComment(Authentication authentication, @RequestBody PostExhibitionCommentRequest request) {
        return ResponseUtils.ok(exhibitionService.saveExhibitionComment(authentication, request), MsgType.INSERT_EXHIBITION_COMMENT_SUCCESSFULLY);
    }

    /**
     * 전시회 전체목록 조회
     */
    @Operation(summary = "전시회 전체목록 조회 요청")
    @GetMapping("/")
    public ApiResponseDto<?> selectExhibitionList(Authentication authentication) {
        return ResponseUtils.ok(exhibitionService.selectExhibitionList(authentication), MsgType.SELECT_EXHIBITION_LIST_SUCCESSFULLY);
    }

    /**
     * 상대방 전시회 목록 조회
     */
    @Operation(summary = "상대방 전체목록 조회 요청")
    @GetMapping("/all/{member-id}")
    public ApiResponseDto<?> selectExhibitionList(Authentication authentication, @PathVariable("member-id") Long memberId) {
        return ResponseUtils.ok(exhibitionService.selectMemberExhibitionList(authentication, memberId), MsgType.SELECT_EXHIBITION_LIST_SUCCESSFULLY);
    }
}

package org.ssafy.d103.exhibitions.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.exhibitions.dto.request.PostInsertExhibitionRequest;
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
}

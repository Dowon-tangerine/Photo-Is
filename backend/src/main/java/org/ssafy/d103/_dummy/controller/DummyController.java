package org.ssafy.d103._dummy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103._dummy.service.DummyService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class DummyController {

    private final DummyService dummyService;

    @GetMapping("/photos/")
    public ApiResponseDto<?> selectThumbnails(Pageable pageable) {
        return ResponseUtils.ok(dummyService.selectPhotoList(), MsgType.TEST_MSG);
    }
}

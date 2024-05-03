package org.ssafy.d103.communities.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.communities.dto.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.service.PhotoService;

import java.io.IOException;

@Tag(name = "communities", description = "Communities API")
@Slf4j
@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/upload")
    public ApiResponseDto<?> postUploadPhoto(Authentication authentication, @RequestPart(value = "photoInfo") PostUploadPhotoRequest postUploadPhotoRequest, @RequestPart(value = "photo", required = false) MultipartFile multipartFile) throws IOException {
        return ResponseUtils.ok(photoService.uploadPhoto(authentication, multipartFile, postUploadPhotoRequest), MsgType.PHOTO_UPLOAD_SUCCESSFULLY);
    }
}
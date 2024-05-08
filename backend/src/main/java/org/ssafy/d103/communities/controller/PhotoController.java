package org.ssafy.d103.communities.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;
import org.ssafy.d103._common.response.ResponseUtils;
import org.ssafy.d103.communities.dto.request.PostChangePhotoLikeRequest;
import org.ssafy.d103.communities.dto.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.dto.request.PutModifyPhotoRequest;
import org.ssafy.d103.communities.service.PhotoService;

@Tag(name = "communities", description = "Communities API")
@Slf4j
@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping("/upload")
    public ApiResponseDto<?> postUploadPhoto(Authentication authentication, @RequestPart(value = "photoInfo") PostUploadPhotoRequest postUploadPhotoRequest, @RequestPart(value = "photo", required = false) MultipartFile multipartFile) {
        return ResponseUtils.ok(photoService.uploadPhoto(authentication, multipartFile, postUploadPhotoRequest), MsgType.PHOTO_UPLOAD_SUCCESSFULLY);
    }

    @PutMapping("/modify")
    public ApiResponseDto<?> putModifyPhoto(Authentication authentication, @RequestBody PutModifyPhotoRequest putModifyPhotoRequest) {
        return ResponseUtils.ok(photoService.modifyPhoto(authentication, putModifyPhotoRequest), MsgType.PHOTO_MODIFY_SUCCESSFULLY);
    }

    @DeleteMapping("/remove/{photo-id}")
    public ApiResponseDto<?> deleteRemovePhoto(Authentication authentication, @PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.deletePhoto(authentication, photoId), MsgType.PHOTO_DELETE_SUCCESSFULLY);
    }

    @GetMapping("/my/{access-type}")
    public ApiResponseDto<?> getPhotoByAccessType(Authentication authentication, @PathVariable("access-type") String accessType) {
        return ResponseUtils.ok(photoService.getPhotoByAccessType(authentication, accessType), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/all")
    public ApiResponseDto<?> getPhotoAll(Authentication authentication) {
        return ResponseUtils.ok(photoService.getPhotoAll(authentication), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/gallery")
    public ApiResponseDto<?> getGalleryPhoto(Authentication authentication) {
        return ResponseUtils.ok(photoService.getGalleryPhoto(authentication), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/{photo-id}")
    public ApiResponseDto<?> getPhotoDetail(Authentication authentication, @PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.getPhotoDetail(authentication, photoId), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @PostMapping("/change-like")
    public ApiResponseDto<?> postChangePhotoLike(Authentication authentication, @RequestBody PostChangePhotoLikeRequest postChangePhotoLikeRequest) {
        return ResponseUtils.ok(photoService.changePhotoLike(authentication, postChangePhotoLikeRequest), MsgType.PHOTO_LIKE_CHANGE_SUCCESSFULLY);
    }

}
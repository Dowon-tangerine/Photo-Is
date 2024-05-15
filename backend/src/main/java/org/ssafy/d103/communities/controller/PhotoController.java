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
import org.ssafy.d103.communities.dto.photo.request.DeletePhotoCommentRequest;
import org.ssafy.d103.communities.dto.photo.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.dto.photo.request.PostWritePhotoCommentRequest;
import org.ssafy.d103.communities.dto.photo.request.PutModifyPhotoRequest;
import org.ssafy.d103.communities.service.PhotoService;

@Tag(name = "Communities - Photo", description = "Communities Photo API")
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

    @PutMapping("/{photo-id}")
    public ApiResponseDto<?> putModifyPhoto(Authentication authentication, @PathVariable("photo-id") Long photoId, @RequestBody PutModifyPhotoRequest putModifyPhotoRequest) {
        return ResponseUtils.ok(photoService.modifyPhoto(authentication, photoId, putModifyPhotoRequest), MsgType.PHOTO_MODIFY_SUCCESSFULLY);
    }

    @DeleteMapping("/{photo-id}")
    public ApiResponseDto<?> deletePhoto(Authentication authentication, @PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.deletePhoto(authentication, photoId), MsgType.PHOTO_DELETE_SUCCESSFULLY);
    }

    @GetMapping("/my/{access-type}")
    public ApiResponseDto<?> getMyPhotoByAccessType(Authentication authentication, @PathVariable("access-type") String accessType, @RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(photoService.getMyPhotoByAccessType(authentication, accessType, page, size), MsgType.MY_PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/others/{member-id}")
    public ApiResponseDto<?> getOthersPhoto(Authentication authentication, @PathVariable("member-id") Long memberId, @RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(photoService.getOthersPhoto(authentication, memberId, page, size), MsgType.OTHERS_PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/my/all")
    public ApiResponseDto<?> getPhotoAll(Authentication authentication, @RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(photoService.getPhotoAll(authentication, page, size), MsgType.MY_PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/gallery/{filter}")
    public ApiResponseDto<?> getGalleryPhoto(Authentication authentication, @PathVariable String filter, @RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(photoService.getGalleryPhoto(authentication, filter, page, size), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @GetMapping("/{photo-id}")
    public ApiResponseDto<?> getPhotoDetail(Authentication authentication, @PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.getPhotoDetail(authentication, photoId), MsgType.PHOTO_GET_SUCCESSFULLY);
    }

    @PostMapping("/{photo-id}/change-like")
    public ApiResponseDto<?> postChangePhotoLike(Authentication authentication, @PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.changePhotoLike(authentication, photoId), MsgType.PHOTO_LIKE_CHANGE_SUCCESSFULLY);
    }

    @PostMapping("/{photo-id}/comment")
    public ApiResponseDto<?> postWriteComment(Authentication authentication, @PathVariable("photo-id") Long photoId, @RequestBody PostWritePhotoCommentRequest postWritePhotoCommentRequest) {
        return ResponseUtils.ok(photoService.writeComment(authentication, photoId, postWritePhotoCommentRequest), MsgType.PHOTO_COMMENT_WRITE_SUCCESSFULLY);
    }

    @GetMapping("/{photo-id}/comment")
    public ApiResponseDto<?> getPhotoCommentList(@PathVariable("photo-id") Long photoId) {
        return ResponseUtils.ok(photoService.getPhotoCommentList(photoId), MsgType.PHOTO_COMMENT_LIST_GET_SUCCESSFULLY);
    }

    @DeleteMapping("/{photo-id}/comment")
    public ApiResponseDto<?> deletePhotoComment(Authentication authentication, @PathVariable("photo-id") Long photoId, @RequestBody DeletePhotoCommentRequest deletePhotoCommentRequest) {
        return ResponseUtils.ok(photoService.removePhotoComment(authentication, photoId, deletePhotoCommentRequest), MsgType.PHOTO_COMMENT_DELETE_SUCCESSFULLY);
    }

    @GetMapping("/search/{search-type}")
    public ApiResponseDto<?> getSearchResultList(Authentication authentication, @PathVariable("search-type") String searchType, @RequestParam String keyword, @RequestParam int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseUtils.ok(photoService.determineSearchMethod(authentication, searchType, keyword, page, size), MsgType.SEARCH_RESULT_LIST_GET_SUCCESSFULLY);
    }

    @GetMapping("/ranking/{type}")
    public ApiResponseDto<?> getRankings(Authentication authentication, @PathVariable String type) {
        return ResponseUtils.ok(photoService.getPhotoRanking(authentication, type), MsgType.PHOTO_RANKING_GET_SUCCESSFULLY);
    }

}
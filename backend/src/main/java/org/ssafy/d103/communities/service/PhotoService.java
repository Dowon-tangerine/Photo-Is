package org.ssafy.d103.communities.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.dto.request.PostChangePhotoLikeRequest;
import org.ssafy.d103.communities.dto.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.dto.request.PostWriteCommentRequest;
import org.ssafy.d103.communities.dto.request.PutModifyPhotoRequest;
import org.ssafy.d103.communities.dto.response.*;
import org.ssafy.d103.communities.entity.photo.*;
import org.ssafy.d103.communities.repository.*;
import org.ssafy.d103.members.entity.Members;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {

    private static final String SUFFIX = ".jpg";
    private static final String THUMBNAIL_TAIL = "-th";

    private static final int MAX_IMAGE_DIMENSION = 500; // 최대 이미지 크기 (가로 또는 세로)
    private static final double OUTPUT_QUALITY = 0.7;

    private final AmazonS3Client amazonS3Client;

    private final PhotoRepository photoRepository;

    private final PhotoMetadataRepository photoMetadataRepository;

    private final PhotoDetailRepository photoDetailRepository;

    private final HashtagRepository hashtagRepository;

    private final PhotoHashtagRepository photoHashtagRepository;

    private final PhotoLikeRepository photoLikeRepository;

    private final PhotoCommentRepository photoCommentRepository;

    private final CommonService commonService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional
    public PostUploadPhotoResponse uploadPhoto(Authentication authentication, MultipartFile multipartFile, PostUploadPhotoRequest postUploadPhotoRequest) {

        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = Photo.of(postUploadPhotoRequest.getTitle(), null, null, AccessType.fromString(postUploadPhotoRequest.getAccessType()), member);

        Photo savedPhoto = uploadImageFile(multipartFile, photo);
        saveMetadata(multipartFile, savedPhoto);
        saveHashtag(postUploadPhotoRequest.getHashtagList(), savedPhoto);
        photoDetailRepository.save(PhotoDetail.init(savedPhoto));

        return PostUploadPhotoResponse.of(true);
    }

    private Photo uploadImageFile(MultipartFile imageFile, Photo photo) {
        try {
            String uuid = UUID.randomUUID().toString();
            String originalUrl = putS3(imageFile, uuid);
            String thumbnailUrl = putS3(convertToThumbnail(imageFile), uuid);

            Photo savePhoto = Photo.of(photo.getTitle(), originalUrl, thumbnailUrl, photo.getAccessType(), photo.getMember());
            return photoRepository.save(savePhoto);
        } catch (Exception e) {
            throw new CustomException(ErrorType.DB_SAVE_ERROR);
        }
    }

    private String putS3(MultipartFile imageFile, String fileName) throws IOException {
        fileName += SUFFIX;

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(imageFile.getInputStream().available());
        objectMetadata.setContentType("image/png");

        amazonS3Client.putObject(bucket, fileName, imageFile.getInputStream(), objectMetadata);

        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private File convertToThumbnail(MultipartFile imageFile) throws IOException {
        File tempFile = File.createTempFile("thumbnail-", ".png"); // 임시 파일 생성

        Thumbnails.of(imageFile.getInputStream())
                .size(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION) // 최대 크기 설정
                .outputQuality(OUTPUT_QUALITY)   // 이미지 품질 설정
                .keepAspectRatio(true)           // 비율 유지
                .toFile(tempFile);               // 파일로 저장

        return tempFile;
    }

    private String putS3(File file, String fileName) {
        fileName += THUMBNAIL_TAIL + SUFFIX;

        amazonS3Client.putObject(bucket, fileName, file);
        deleteFile(file);

        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private void deleteFile(File file) {
        if (!file.delete()) {
            throw new RuntimeException("썸네일 파일 제거에 실패했습니다.");
        }
    }

    private void saveMetadata(MultipartFile file, Photo photo) {
        try {
            Metadata metadata = ImageMetadataReader.readMetadata(file.getInputStream());

            ExifSubIFDDirectory exifDirectory = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
            ExifIFD0Directory directory = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory.class);

            Date time = null;
            String cameraType = null;
            String cameraModel = null;
            String lensModel = null;
            String aperture = null;
            String focusDistance = null;
            String shutterSpeed = null;
            String iso = null;
            Double latitude = null;
            Double longitude = null;

            if (directory != null) {
                time = exifDirectory.getDate(ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL);
                cameraType = directory.getDescription(ExifIFD0Directory.TAG_MAKE);
                cameraModel = directory.getDescription(ExifIFD0Directory.TAG_MODEL);
                lensModel = extractLensModel(metadata);
                aperture = exifDirectory.getDescription(ExifSubIFDDirectory.TAG_APERTURE);
                focusDistance = exifDirectory.getDescription(ExifSubIFDDirectory.TAG_FOCAL_LENGTH);
                shutterSpeed = exifDirectory.getDescription(ExifSubIFDDirectory.TAG_EXPOSURE_TIME);
                iso = exifDirectory.getDescription(ExifSubIFDDirectory.TAG_ISO_EQUIVALENT);
            }

            if (gpsDirectory != null && gpsDirectory.getGeoLocation() != null) {
                latitude = gpsDirectory.getGeoLocation().getLatitude();
                longitude = gpsDirectory.getGeoLocation().getLongitude();

            }

            photoMetadataRepository.save(PhotoMetadata.of(time, cameraType, cameraModel, lensModel, aperture, focusDistance, shutterSpeed, iso, latitude, longitude, photo));

        } catch (IOException | ImageProcessingException e) {
            e.getStackTrace();
        }
    }

    private String extractLensModel(Metadata metadata) {
        String lensModel = null;

        // 일반적인 EXIF 디렉토리에서 렌즈 정보 추출 시도
        ExifSubIFDDirectory directory = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
        if (directory != null && directory.containsTag(ExifSubIFDDirectory.TAG_LENS_MODEL)) {
            lensModel = directory.getDescription(ExifSubIFDDirectory.TAG_LENS_MODEL);
        }

        // Makernote 또는 다른 디렉토리에서 렌즈 모델을 찾을 경우
        if (lensModel == null) {
            for (Directory dir : metadata.getDirectories()) {
                for (Tag tag : dir.getTags()) {
                    if (tag.getTagName().toLowerCase().contains("lens")) {
                        lensModel = tag.getDescription();
                        break;
                    }
                }
                if (lensModel != null) break;
            }
        }

        return lensModel;
    }

    private void saveHashtag(List<String> hashtagList, Photo photo) {
        for (String tag : hashtagList) {
            Optional<Hashtag> findHashtag = hashtagRepository.findHashtagByTagText(tag);

            if (findHashtag.isPresent()) {
                photoHashtagRepository.save(PhotoHashtag.of(photo, findHashtag.get()));
            } else {
                Hashtag hashtag = hashtagRepository.save(Hashtag.of(tag));
                photoHashtagRepository.save(PhotoHashtag.of(photo, hashtag));
            }
        }
    }

    @Transactional
    public PutModifyPhotoResponse modifyPhoto(Authentication authentication, PutModifyPhotoRequest putModifyPhotoRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoByIdAndMember(putModifyPhotoRequest.getPhotoId(), member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        photo.modifyPhoto(putModifyPhotoRequest);

        photoHashtagRepository.deletePhotoHashtagByPhoto(photo);
        saveHashtag(putModifyPhotoRequest.getHashtagList(), photo);

        List<PhotoHashtag> photoHashtagList = photoHashtagRepository.findAllByPhoto(photo);
        List<String> hashtagList = new ArrayList<>();
        for (PhotoHashtag photoHashtag : photoHashtagList) {
            Hashtag hashtag = hashtagRepository.findHashtagById(photoHashtag.getHashtag().getId())
                    .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_HASHTAG));
            hashtagList.add(hashtag.getTagText());
        }

        return PutModifyPhotoResponse.of(photo.getTitle(), photo.getAccessType(), photo.getCreatedAt(), hashtagList);
    }

    @Transactional
    public DeleteRemovePhotoResponse deletePhoto(Authentication authentication, Long photoId) {
        Members member = commonService.findMemberByAuthentication(authentication);

        // 삭제할 사진을 데이터베이스에서 가져옴
        Photo photo = photoRepository.findPhotoByIdAndMember(photoId, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        // S3에서 썸네일 이미지와 원본 이미지를 삭제
        deleteS3Image(photo.getImageUrl());
        deleteS3Image(photo.getThumbnailUrl());

        // 데이터베이스에서 사진 삭제
        try {
            photoRepository.deleteByIdAndMember(photoId, member);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException(ErrorType.DB_DELETE_ERROR);
        }

        // !!!!!!!!!!!!!!!!!!!! Question API 구현 후, 사진 삭제에 따른 질문 삭제도 구현해야함 !!!!!!!!!!!!!!!!!!!!

        return DeleteRemovePhotoResponse.of(true);
    }

    private void deleteS3Image(String imageUrl) {
        String fileName = extractFileNameFromUrl(imageUrl);
        amazonS3Client.deleteObject(bucket, fileName);
    }

    private String extractFileNameFromUrl(String imageUrl) {
        String[] parts = imageUrl.split("/");
        return parts[parts.length - 1];
    }

    public List<GetBasicPhotoInfoResponse> getPhotoByAccessType(Authentication authentication, String accessType) {
        Members member = commonService.findMemberByAuthentication(authentication);

        List<Photo> MemberPhotoList = photoRepository.findAllByMemberAndAccessTypeOrderByCreatedAtDesc(member, AccessType.fromString(accessType));
        return getBasicPhotoInfo(MemberPhotoList);
    }

    public List<GetBasicPhotoInfoResponse> getPhotoAll(Authentication authentication) {
        Members member = commonService.findMemberByAuthentication(authentication);

        List<Photo> MemberPhotoList = photoRepository.findAllByMemberOrderByCreatedAtDesc(member);
        return getBasicPhotoInfo(MemberPhotoList);
    }

    private List<GetBasicPhotoInfoResponse> getBasicPhotoInfo(List<Photo> memberPhotoList) {
        List<GetBasicPhotoInfoResponse> getBasicPhotoInfoResponseList = new ArrayList<>();

        for (Photo photo : memberPhotoList) {
            PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                    .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
            getBasicPhotoInfoResponseList.add(GetBasicPhotoInfoResponse.from(photo, photoDetail.getLikeCnt()));
        }

        return getBasicPhotoInfoResponseList;
    }

    public List<GetGalleryPhotoInfoResponse> getGalleryPhoto(Authentication authentication) {
        // 전체 갤러리 사진 리스트
        List<Photo> allGalleryPhotoList = photoRepository.findAllByOrderByCreatedAtDesc();

        // 결과 반환 리스트
        List<GetGalleryPhotoInfoResponse> getGalleryPhotoInfoResponseList = new ArrayList<>();

        // 토큰 O -> 로그인 O
        if (authentication != null) {
            Members member = commonService.findMemberByAuthentication(authentication);

            // 해당 멤버가 좋아요 목록 가져옴
            List<PhotoLike> photoLikeList = photoLikeRepository.findAllByMember(member);

            // 좋아요한 사진들의 Photo ID만 추출
            List<Long> photoIdList = new ArrayList<>();

            for (PhotoLike photoLike : photoLikeList) {
                photoIdList.add(photoLike.getPhoto().getId());
            }

            // 갤러리 사진 목록 전체에 대한 좋아요 여부 표시
            for (Photo photo : allGalleryPhotoList) {
                PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                        .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                getGalleryPhotoInfoResponseList.add(GetGalleryPhotoInfoResponse.from(photo, photoDetail.getLikeCnt(), photoIdList.contains(photo.getId())));
            }
        }
        // 토큰 X -> 로그인 X
        else {
            for (Photo photo : allGalleryPhotoList) {
                PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                        .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                getGalleryPhotoInfoResponseList.add(GetGalleryPhotoInfoResponse.from(photo, photoDetail.getLikeCnt(), false));
            }
        }

        return getGalleryPhotoInfoResponseList;
    }

    public GetPhotoDetailInfoResponse getPhotoDetail(Authentication authentication, Long photoId) {

        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        PhotoMetadata findMetadata = photoMetadataRepository.findPhotoMetadataByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_METADATA));

        List<PhotoHashtag> photoHashtagList = photoHashtagRepository.findAllByPhoto(photo);
        List<String> hashtagList = new ArrayList<>();

        for (PhotoHashtag photoHashtag : photoHashtagList) {
            hashtagList.add(photoHashtag.getHashtag().getTagText());
        }

        // 토큰 O -> 로그인 O
        if (authentication != null) {
            Members member = commonService.findMemberByAuthentication(authentication);
            return GetPhotoDetailInfoResponse.of(photo, photoDetail, photoLikeRepository.findPhotoLikeByMemberAndPhoto(member, photo).isPresent(), PhotoMetadata.from(findMetadata), hashtagList);
        }
        // 토큰 X -> 로그인 X
        else {
            return GetPhotoDetailInfoResponse.of(photo, photoDetail, false, PhotoMetadata.from(findMetadata), hashtagList);
        }
    }

    @Transactional
    public PostChangePhotoLikeResponse changePhotoLike(Authentication authentication, PostChangePhotoLikeRequest postChangePhotoLikeRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoById(postChangePhotoLikeRequest.getPhotoId())
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        // 본인 사진 좋아요 불가
        if (photo.getMember().equals(member)) {
            throw new CustomException(ErrorType.SELF_LIKE_NOT_ALLOWED);
        }

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        Optional<PhotoLike> findPhotoLike = photoLikeRepository.findPhotoLikeByMemberAndPhoto(member, photo);

        // 좋아요 기록이 있다면 Delete
        if (findPhotoLike.isPresent()) {
            photoLikeRepository.delete(findPhotoLike.get());
            return PostChangePhotoLikeResponse.of(false, photoDetail.updateLikeCnt(false));
        }
        // 좋아요 기록이 없다면 Insert
        else {
            photoLikeRepository.save(PhotoLike.of(member, photo));
            return PostChangePhotoLikeResponse.of(true, photoDetail.updateLikeCnt(true));
        }
    }

    @Transactional
    public PostWriteCommentResponse writeComment(Authentication authentication, Long photoId, PostWriteCommentRequest postWriteCommentRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        photoCommentRepository.save(PhotoComment.of(postWriteCommentRequest.getComment(), member, photo));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        List<PhotoComment> photoCommentList = photoCommentRepository.findAllByPhoto(photo);

        return PostWriteCommentResponse.of(photoDetail.updateCommentCnt(true), photoCommentList);
    }
}
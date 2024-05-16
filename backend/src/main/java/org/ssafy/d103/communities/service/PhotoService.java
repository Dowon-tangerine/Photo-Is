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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.photo.AuthorProfileDto;
import org.ssafy.d103.communities.dto.photo.MyPhotoDto;
import org.ssafy.d103.communities.dto.photo.PhotoDto;
import org.ssafy.d103.communities.dto.photo.PhotoRankingDto;
import org.ssafy.d103.communities.dto.photo.request.DeletePhotoCommentRequest;
import org.ssafy.d103.communities.dto.photo.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.dto.photo.request.PostWritePhotoCommentRequest;
import org.ssafy.d103.communities.dto.photo.request.PutModifyPhotoRequest;
import org.ssafy.d103.communities.dto.photo.response.*;
import org.ssafy.d103.communities.entity.photo.*;
import org.ssafy.d103.communities.repository.photo.*;
import org.ssafy.d103.exhibitions.repository.ExhibitionPhotoRepository;
import org.ssafy.d103.follows.entity.Follows;
import org.ssafy.d103.follows.repository.FollowRepository;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

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

    private final DailyPhotoRankingRepository dailyPhotoRankingRepository;

    private final WeeklyPhotoRankingRepository weeklyPhotoRankingRepository;

    private final MonthlyPhotoRankingRepository monthlyPhotoRankingRepository;

    private final ExhibitionPhotoRepository exhibitionPhotoRepository;

    private final MemberRepository memberRepository;

    private final FollowRepository followRepository;

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
            String originalUrl = putS3(imageFile, "originPhoto", uuid);
            String thumbnailUrl = putS3(convertToThumbnail(imageFile), "thumbnailPhoto", uuid);

            Photo savePhoto = Photo.of(photo.getTitle(), originalUrl, thumbnailUrl, photo.getAccessType(), photo.getMember());
            return photoRepository.save(savePhoto);
        } catch (Exception e) {
            throw new CustomException(ErrorType.DB_SAVE_ERROR);
        }
    }

    private String putS3(MultipartFile imageFile, String folder, String fileName) throws IOException {
        fileName = folder + "/" + fileName + SUFFIX;

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(imageFile.getInputStream().available());
        objectMetadata.setContentType("image/jpg");

        amazonS3Client.putObject(bucket, fileName, imageFile.getInputStream(), objectMetadata);

        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private File convertToThumbnail(MultipartFile imageFile) throws IOException {
        File tempFile = File.createTempFile("thumbnail-", ".jpg"); // 임시 파일 생성

        Thumbnails.of(imageFile.getInputStream())
                .size(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION) // 최대 크기 설정
                .outputQuality(OUTPUT_QUALITY)   // 이미지 품질 설정
                .keepAspectRatio(true)           // 비율 유지
                .toFile(tempFile);               // 파일로 저장

        return tempFile;
    }

    private String putS3(File file, String folder, String fileName) {
        fileName = folder + "/" + fileName + THUMBNAIL_TAIL + SUFFIX;

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
    public PutModifyPhotoResponse modifyPhoto(Authentication authentication, Long photoId, PutModifyPhotoRequest putModifyPhotoRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoByIdAndMember(photoId, member)
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
    public DeletePhotoResponse deletePhoto(Authentication authentication, Long photoId) {
        Members member = commonService.findMemberByAuthentication(authentication);

        // 삭제할 사진을 데이터베이스에서 가져옴
        Photo photo = photoRepository.findPhotoByIdAndMember(photoId, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        if (!exhibitionPhotoRepository.findByPhotoId(photo).isEmpty()) {
            throw new CustomException(ErrorType.CANNOT_DELETE_PHOTO_USING_EXHIBITION);
        }

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

        return DeletePhotoResponse.of(true);
    }

    private void deleteS3Image(String imageUrl) {
        String fileName = extractFileNameFromUrl(imageUrl);
        amazonS3Client.deleteObject(bucket, fileName);
    }

    private String extractFileNameFromUrl(String imageUrl) {
        String[] parts = imageUrl.split("/");
        return parts[parts.length - 1];
    }


    // ------------------------------------------------ [Get Photo] --------------------------------------------------------
    // createPageable로 페이지네이션 설정
    // determineGallerySort로 갤러리 필터에 따른 정렬 순서를 반환
    // getLikedPhotoIds로 좋아요한 사진 ID 목록 가져옴
    // createBasicPhotoInfoResponse로 GetBasicPhotoInfoResponse 생성

    // *** 사용자의 사진을 AccessType에 따라 최신순으로 모두 불러오는 메소드 ***
    public GetMyPhotoResponse getMyPhotoByAccessType(Authentication authentication, String accessType, int page, int size) {
        Members member = commonService.findMemberByAuthentication(authentication);
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 특정 액세스 타입에 대한 페이지네이션된 사진 가져오기
        Page<Photo> photoPage = photoRepository.findAllByMemberAndAccessTypeOrderByCreatedAtDesc(member, AccessType.fromString(accessType), pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_GALLERY_PHOTO_PAGE);
        }

        // 내 좋아요 목록 가져옴
        List<Long> likedPhotoIds = getLikedPhotoIds(authentication);

        // 각 사진을 DTO로 변환하여 좋아요 여부 확인
        List<PhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    boolean isLiked = likedPhotoIds.contains(photo.getId());
                    return PhotoDto.from(photo, photoDetail.getLikeCnt(), isLiked);
                })
                .collect(Collectors.toList());

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        // 전체 사진 수 및 갤러리 사진 리스트 응답 생성
        return GetMyPhotoResponse.of(accessType, (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    public GetOthersPhotoResponse getOthersPhoto(Authentication authentication, Long memberId, int page, int size) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_MEMBER));

        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 특정 액세스 타입에 대한 페이지네이션된 사진 가져오기
        Page<Photo> photoPage = photoRepository.findAllByMemberAndAccessTypeOrderByCreatedAtDesc(member, AccessType.PUBLIC, pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_GALLERY_PHOTO_PAGE);
        }

        // 로그인한 사용자의 좋아요 목록 가져옴 (로그인한 경우에만)
        List<Long> likedPhotoIds = getLikedPhotoIds(authentication);

        // 각 사진을 DTO로 변환하여 좋아요 여부 확인
        List<PhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    boolean isLiked = likedPhotoIds.contains(photo.getId());
                    return PhotoDto.from(photo, photoDetail.getLikeCnt(), isLiked);
                })
                .toList();

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        // 결과 생성 및 반환
        return GetOthersPhotoResponse.of(AccessType.PUBLIC.getAccessTypeName(), (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // *** 사용자의 사진을 최신순으로 모두 불러오는 메소드 ***
    public GetMyPhotoResponse getPhotoAll(Authentication authentication, int page, int size) {
        Members member = commonService.findMemberByAuthentication(authentication);
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 모든 사진을 페이지네이션하여 가져오기
        Page<Photo> photoPage = photoRepository.findAllByMemberOrderByCreatedAtDesc(member, pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_GALLERY_PHOTO_PAGE);
        }

        // 결과 생성 및 반환
        List<MyPhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    return MyPhotoDto.from(photo, photoDetail.getLikeCnt());
                })
                .collect(Collectors.toList());

        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        return GetMyPhotoResponse.of("all", (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // *** 갤러리 페이지 사진 가져오는 메소드 ***
    public GetGalleryPhotoInfoResponse getGalleryPhoto(Authentication authentication, String filterName, int page, int size) {
        Pageable pageable = createPageable(page, size, determineGallerySort(filterName));

        // 페이지네이션된 사진 데이터 가져오기
        Page<Photo> photoPage = photoRepository.findAllByAccessType(AccessType.PUBLIC, pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_GALLERY_PHOTO_PAGE);
        }

        // 로그인한 사용자의 좋아요 목록 가져옴 (로그인한 경우에만)
        List<Long> likedPhotoIds = getLikedPhotoIds(authentication);

        // 각 사진을 DTO로 변환하여 좋아요 여부 확인
        List<PhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    boolean isLiked = likedPhotoIds.contains(photo.getId());
                    return PhotoDto.from(photo, photoDetail.getLikeCnt(), isLiked);
                })
                .collect(Collectors.toList());

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        // 전체 사진 수 및 갤러리 사진 리스트 응답 생성
        return GetGalleryPhotoInfoResponse.of(filterName, (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // *** 페이지네이션 설정하는 메소드 ***
    private Pageable createPageable(int page, int size, Sort sort) {
        int adjustedPage = Math.max(page - 1, 0);
        return PageRequest.of(adjustedPage, size, sort);
    }

    // *** 갤러리 필터에 따른 정렬 순서를 반환하는 메소드 ***
    private Sort determineGallerySort(String filterName) {
        Filter filter = Filter.fromString(filterName);
        return switch (filter) {
            case LIKE -> Sort.by(Sort.Direction.DESC, "photoDetail.likeCnt")
                    .and(Sort.by(Sort.Direction.DESC, "createdAt")); // 좋아요 수 동일시 최신순
            case VIEW -> Sort.by(Sort.Direction.DESC, "photoDetail.viewCnt")
                    .and(Sort.by(Sort.Direction.DESC, "createdAt")); // 조회수 동일시 최신순
            default -> Sort.by(Sort.Direction.DESC, "createdAt"); // 최신순 기본
        };
    }

    // *** 좋아요한 사진 ID 목록 가져오는 메소드 ***
    private List<Long> getLikedPhotoIds(Authentication authentication) {
        if (authentication != null) {
            Members member = commonService.findMemberByAuthentication(authentication);
            List<PhotoLike> photoLikeList = photoLikeRepository.findAllByMember(member);
            return photoLikeList.stream()
                    .map(photoLike -> photoLike.getPhoto().getId())
                    .toList();
        } else {
            return new ArrayList<>();
        }
    }

    // *** GetMyPhotoInfoResponse 생성 메소드 ***
    private GetMyPhotoResponse createBasicPhotoInfoResponse(Page<Photo> photoPage, String accessType) {
        List<MyPhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    return MyPhotoDto.from(photo, photoDetail.getLikeCnt());
                })
                .collect(Collectors.toList());

        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        return GetMyPhotoResponse.of(accessType, (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // =======================================================================================================================

    // ------------------------------------------------ [Get Search results] -------------------------------------------------
    // *** Controller에서 받아온 SearchType을 기준으로 검색 타입 결정하는 메소드 ***
    public GetSearchResultResponse determineSearchMethod(Authentication authentication, String searchType, String keyword, int page, int size) {
        SearchType type = SearchType.fromString(searchType);

        if (type.equals(SearchType.TITLE)) {
            return searchPhotosByTitle(authentication, keyword, page, size);
        } else if (type.equals(SearchType.AUTHOR)) {
            return searchAuthorsByNickname(authentication, keyword, page, size);
        } else if (type.equals(SearchType.HASHTAG)) {
            return searchPhotosByHashtag(authentication, keyword, page, size);
        }

        throw new CustomException(ErrorType.BAD_REQUEST);
    }

    // *** 제목으로 사진 검색 ***
    public GetSearchResultResponse searchPhotosByTitle(Authentication authentication, String title, int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Photo> photoPage = photoRepository.findByAccessTypeAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(AccessType.PUBLIC, title, pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_SEARCH_RESULTS_PAGE);
        }

        // 로그인한 사용자의 좋아요한 사진 ID 가져옴
        List<Long> likedPhotoIds = getLikedPhotoIds(authentication);

        // 각 사진을 DTO로 변환하여 좋아요 여부 확인
        List<PhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    boolean isLiked = likedPhotoIds.contains(photo.getId());
                    return PhotoDto.from(photo, photoDetail.getLikeCnt(), isLiked);
                })
                .collect(Collectors.toList());

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        // 전체 사진 수 및 갤러리 사진 리스트 응답 생성
        return GetSearchResultResponse.of(title, SearchType.TITLE.toString(), (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // *** 작가명으로 작가 프로필 검색 ***
    public GetSearchResultResponse searchAuthorsByNickname(Authentication authentication, String searchKeyword, int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "nickname"));

        Page<Members> memberPage = memberRepository.findByNicknameContainingIgnoreCase(searchKeyword, pageable);

        if (memberPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_SEARCH_RESULTS_PAGE);
        }

        // 로그인된 사용자가 팔로우한 멤버의 ID 목록을 가져옴
        List<Long> followedMemberIds = getFollowedMemberIds(authentication);

        // 멤버 리스트를 DTO로 변환하면서 각 멤버에 대해 팔로우 여부와 프로필 정보를 가져옴
        List<AuthorProfileDto> authorProfileList = memberPage.getContent().stream()
                .map(member -> {
                    int uploadedPhotoCount = photoRepository.countByMember(member);
                    int followingCount = followRepository.countByFollowerId(member);
                    int followerCount = followRepository.countByFollowingId(member);

                    boolean isFollow = authentication != null && followedMemberIds.contains(member.getId());

                    return AuthorProfileDto.of(member.getId(), member.getNickname(), member.getProfileUrl(), member.getUseYear(), member.getCity(), member.getCountry(), uploadedPhotoCount, followingCount, followerCount, isFollow);
                })
                .collect(Collectors.toList());

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                memberPage.getNumber() + 1,
                memberPage.getTotalPages(),
                (int) memberPage.getTotalElements(),
                memberPage.getSize());

        return GetSearchResultResponse.of(searchKeyword, SearchType.AUTHOR.toString(), (int) memberPage.getTotalElements(), authorProfileList, paginationDataDto);
    }

    // 사용자의 팔로잉 리스트 생성
    private List<Long> getFollowedMemberIds(Authentication authentication) {
        if (authentication != null) {
            Members member = commonService.findMemberByAuthentication(authentication);
            List<Follows> followedList = followRepository.findAllByFollowerId(member)
                    .orElse(Collections.emptyList());

            return followedList.stream()
                    .map(follow -> follow.getFollowingId().getId())
                    .collect(Collectors.toList());
        } else {
            return Collections.emptyList();
        }
    }

    // *** 해시태그로 사진 검색 ***
    public GetSearchResultResponse searchPhotosByHashtag(Authentication authentication, String tagText, int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        List<Long> photoIds = hashtagRepository.findPhotosByHashtagText(tagText);
        Page<Photo> photoPage = photoRepository.findByAccessTypeAndIdInOrderByCreatedAtDesc(AccessType.PUBLIC, photoIds, pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (photoPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_SEARCH_RESULTS_PAGE);
        }

        // 로그인한 사용자의 좋아요한 사진 ID 가져오기
        List<Long> likedPhotoIds = getLikedPhotoIds(authentication);

        // 각 사진을 DTO로 변환하여 좋아요 여부 확인
        List<PhotoDto> photoDtoList = photoPage.getContent().stream()
                .map(photo -> {
                    PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                            .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
                    boolean isLiked = likedPhotoIds.contains(photo.getId());
                    return PhotoDto.from(photo, photoDetail.getLikeCnt(), isLiked);
                })
                .collect(Collectors.toList());

        // 페이지네이션 정보 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                photoPage.getNumber() + 1,
                photoPage.getTotalPages(),
                (int) photoPage.getTotalElements(),
                photoPage.getSize());

        // 전체 사진 수 및 갤러리 사진 리스트 응답 생성
        return GetSearchResultResponse.of(tagText, SearchType.HASHTAG.toString(), (int) photoPage.getTotalElements(), photoDtoList, paginationDataDto);
    }

    // =======================================================================================================================

    @Transactional
    public GetPhotoDetailInfoResponse getPhotoDetail(Authentication authentication, Long photoId) {
        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        // 조회수 증가
        photoDetail.updateViewCnt(true);

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
            return GetPhotoDetailInfoResponse.from(photo, photoLikeRepository.findPhotoLikeByMemberAndPhoto(member, photo).isPresent(), hashtagList);
        }
        // 토큰 X -> 로그인 X
        else {
            return GetPhotoDetailInfoResponse.from(photo, false, hashtagList);
        }
    }

    @Transactional
    public PostChangePhotoLikeResponse changePhotoLike(Authentication authentication, Long photoId) {
        Members member = commonService.findMemberByAuthentication(authentication);
        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        Optional<PhotoLike> findPhotoLike = photoLikeRepository.findPhotoLikeByMemberAndPhoto(member, photo);
        boolean isAlreadyLiked = findPhotoLike.isPresent();

        if (isAlreadyLiked) {
            photoLikeRepository.delete(findPhotoLike.get());
            photoDetail.updateLikeCnt(false);
        } else {
            photoLikeRepository.save(PhotoLike.of(member, photo));
            photoDetail.updateLikeCnt(true);
        }

        return PostChangePhotoLikeResponse.of(!isAlreadyLiked, photoDetail.getLikeCnt());
    }

    @Transactional
    public PostWritePhotoCommentResponse writeComment(Authentication authentication, Long photoId, PostWritePhotoCommentRequest postWritePhotoCommentRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        photoCommentRepository.save(PhotoComment.of(postWritePhotoCommentRequest.getComment(), member, photo));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        List<PhotoComment> photoCommentList = photoCommentRepository.findAllByPhoto(photo);

        return PostWritePhotoCommentResponse.of(photoDetail.updateCommentCnt(true), photoCommentList);
    }

    @Transactional
    public GetPhotoCommentListResponse getPhotoCommentList(Long photoId) {
        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        List<PhotoComment> photoCommentList = photoCommentRepository.findAllByPhoto(photo);

        return GetPhotoCommentListResponse.of(photoDetail.getCommentCnt(), photoCommentList);
    }

    @Transactional
    public DeletePhotoCommentResponse removePhotoComment(Authentication authentication, Long photoId, DeletePhotoCommentRequest deletePhotoCommentRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Photo photo = photoRepository.findPhotoById(photoId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

        PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        PhotoComment photoComment = photoCommentRepository.findPhotoCommentByIdAndPhotoAndMember(deletePhotoCommentRequest.getCommentId(), photo, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_COMMENT));

        try {
            photoCommentRepository.delete(photoComment);
        } catch (Exception e) {
            throw new CustomException(ErrorType.DB_DELETE_ERROR);
        }

        List<PhotoComment> photoCommentList = photoCommentRepository.findAllByPhoto(photo);

        return DeletePhotoCommentResponse.of(photoDetail.updateCommentCnt(false), photoCommentList);
    }

    @Transactional
    public GetPhotoRankingResponse getPhotoRanking(Authentication authentication, String type) {
        RankingType rankingType = RankingType.fromString(type);

        List<?> rankings = switch (rankingType) {
            case DAILY -> dailyPhotoRankingRepository.findAll(Sort.by(Sort.Direction.ASC, "dailyRanking"));
            case WEEKLY -> weeklyPhotoRankingRepository.findAll(Sort.by(Sort.Direction.ASC, "weeklyRanking"));
            case MONTHLY -> monthlyPhotoRankingRepository.findAll(Sort.by(Sort.Direction.ASC, "monthlyRanking"));
            default -> throw new CustomException(ErrorType.BAD_REQUEST);
        };

        List<Long> likedPhotoIds;
        if (authentication != null) {
            Members member = commonService.findMemberByAuthentication(authentication);
            likedPhotoIds = photoLikeRepository.findAllByMember(member)
                    .stream()
                    .map(photoLike -> photoLike.getPhoto().getId())
                    .toList();
        } else {
            likedPhotoIds = new ArrayList<>();
        }

        List<PhotoRankingDto> rankingList = rankings.stream().map(ranking -> {
            Photo photo;
            Integer rank;
            if (ranking instanceof DailyPhotoRanking dailyRanking) {
                photo = dailyRanking.getPhoto();
                rank = dailyRanking.getDailyRanking();
            } else if (ranking instanceof WeeklyPhotoRanking weeklyRanking) {
                photo = weeklyRanking.getPhoto();
                rank = weeklyRanking.getWeeklyRanking();
            } else if (ranking instanceof MonthlyPhotoRanking monthlyRanking) {
                photo = monthlyRanking.getPhoto();
                rank = monthlyRanking.getMonthlyRanking();
            } else {
                throw new CustomException(ErrorType.BAD_REQUEST);
            }

            PhotoDetail photoDetail = photoDetailRepository.findPhotoDetailByPhoto(photo)
                    .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));
            boolean isLiked = authentication != null && likedPhotoIds.contains(photo.getId());

            return PhotoRankingDto.of(photo.getId(), rank, photo.getThumbnailUrl(), photo.getMember().getProfileUrl(), photo.getMember().getNickname(), photoDetail.getLikeCnt(), isLiked);
        }).collect(Collectors.toList());

        return GetPhotoRankingResponse.of(rankingType.getRankingTypeName(), rankingList);
    }

}
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103.communities.dto.request.PostUploadPhotoRequest;
import org.ssafy.d103.communities.dto.response.PostUploadPhotoResponse;
import org.ssafy.d103.communities.entity.photo.AccessType;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;
import org.ssafy.d103.communities.entity.photo.PhotoMetadata;
import org.ssafy.d103.communities.repository.MetadataRepository;
import org.ssafy.d103.communities.repository.PhotoDetailRepository;
import org.ssafy.d103.communities.repository.PhotoRepository;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;
import org.ssafy.d103.members.service.UserDetailsImpl;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {

    private final MemberRepository memberRepository;
    private static final String SUFFIX = ".jpg";
    private static final String THUMBNAIL_TAIL = "-th";

    private static final int MAX_IMAGE_DIMENSION = 500; // 최대 이미지 크기 (가로 또는 세로)
    private static final double OUTPUT_QUALITY = 0.7;

    private final AmazonS3Client amazonS3Client;

    private final PhotoRepository photoRepository;

    private final MetadataRepository metadataRepository;

    private final PhotoDetailRepository photoDetailRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional
    public PostUploadPhotoResponse uploadPhoto(@AuthenticationPrincipal UserDetailsImpl userDetails, MultipartFile multipartFile, PostUploadPhotoRequest postUploadPhotoRequest) {

        Members member = findMembersByAuthentication(userDetails);

        Photo photo = Photo.of(postUploadPhotoRequest.getTitle(), null, null, AccessType.fromString(postUploadPhotoRequest.getAccessType()), member);

        Photo savedPhoto = uploadImageFile(multipartFile, photo);
        saveMetadata(multipartFile, savedPhoto);

        photoDetailRepository.save(PhotoDetail.init(savedPhoto));

        return PostUploadPhotoResponse.of(true);
    }

    public Photo uploadImageFile(MultipartFile imageFile, Photo photo) {
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

    public void saveMetadata(MultipartFile file, Photo photo) {
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

            metadataRepository.save(PhotoMetadata.of(time, cameraType, cameraModel, lensModel, aperture, focusDistance, shutterSpeed, iso, latitude, longitude, photo));

        } catch (IOException | ImageProcessingException e) {
            e.getStackTrace();
        }
    }

    public String extractLensModel(Metadata metadata) {
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


    public Members findMembersByAuthentication(UserDetailsImpl userDetailsImpl) {
        return memberRepository.findMembersByEmailAndDeletedAtIsNull(userDetailsImpl.getMember().getEmail())
                .orElseThrow(() -> new CustomException(ErrorType.BAD_REQUEST));
    }
}
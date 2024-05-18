package org.ssafy.d103.communities.entity.photo;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhotoMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metadata_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long id;

    private Date time;

    private String cameraType;

    private String cameraModel;

    private String lensModel;

    private String aperture;

    private String focusDistance;

    private String shutterSpeed;

    private String iso;

    private String exposure;

    private Double latitude;

    private Double longitude;

    @OneToOne
    @JoinColumn(name = "photo_id")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Photo photo;

    @Builder
    public PhotoMetadata(Date time, String cameraType, String cameraModel, String lensModel, String aperture, String focusDistance, String shutterSpeed, String iso, String exposure, Double latitude, Double longitude, Photo photo) {
        this.time = time;
        this.cameraType = cameraType;
        this.cameraModel = cameraModel;
        this.lensModel = lensModel;
        this.aperture = aperture;
        this.focusDistance = focusDistance;
        this.shutterSpeed = shutterSpeed;
        this.iso = iso;
        this.exposure = exposure;
        this.latitude = latitude;
        this.longitude = longitude;
        this.photo = photo;
    }

    public static PhotoMetadata of(Date time, String cameraType, String cameraModel, String lensModel, String aperture, String focusDistance, String shutterSpeed, String iso, String exposure, Double latitude, Double longitude, Photo photo) {
        return builder()
                .time(time)
                .cameraType(cameraType)
                .cameraModel(cameraModel)
                .lensModel(lensModel)
                .aperture(aperture)
                .focusDistance(focusDistance)
                .shutterSpeed(shutterSpeed)
                .iso(iso)
                .exposure(exposure)
                .latitude(latitude)
                .longitude(longitude)
                .photo(photo)
                .build();
    }

    public void updateStudioPhotoMetadata(Date time, String iso, String shutterSpeed, String aperture, String exposure) {
        this.time = time;
        this.iso = iso;
        this.shutterSpeed = shutterSpeed;
        this.aperture = aperture;
        this.exposure = exposure;
    }

    public static PhotoMetadata from(PhotoMetadata photoMetadata) {
        return builder()
                .time(photoMetadata.getTime())
                .cameraType(photoMetadata.getCameraType())
                .cameraModel(photoMetadata.getCameraModel())
                .lensModel(photoMetadata.getLensModel())
                .aperture(photoMetadata.getAperture())
                .focusDistance(photoMetadata.getFocusDistance())
                .shutterSpeed(photoMetadata.getShutterSpeed())
                .iso(photoMetadata.getIso())
                .latitude(photoMetadata.getLatitude())
                .longitude(photoMetadata.getLongitude())
                .build();
    }

}
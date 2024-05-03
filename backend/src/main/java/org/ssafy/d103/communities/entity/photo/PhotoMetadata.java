package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PhotoMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metadata_id")
    private Long id;

    private Date time;

    private String cameraType;

    private String cameraModel;

    private String lensModel;

    private String aperture;

    private String focusDistance;

    private String shutterSpeed;

    private String iso;

    private Double latitude;

    private Double longitude;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @Builder
    public PhotoMetadata(Date time, String cameraType, String cameraModel, String lensModel, String aperture, String focusDistance, String shutterSpeed, String iso, Double latitude, Double longitude, Photo photo) {
        this.time = time;
        this.cameraType = cameraType;
        this.cameraModel = cameraModel;
        this.lensModel = lensModel;
        this.aperture = aperture;
        this.focusDistance = focusDistance;
        this.shutterSpeed = shutterSpeed;
        this.iso = iso;
        this.latitude = latitude;
        this.longitude = longitude;
        this.photo = photo;
    }

    public static PhotoMetadata of(Date time, String cameraType, String cameraModel, String lensModel, String aperture, String focusDistance, String shutterSpeed, String iso, Double latitude, Double longitude, Photo photo){
        return builder()
                .time(time)
                .cameraType(cameraType)
                .cameraModel(cameraModel)
                .lensModel(lensModel)
                .aperture(aperture)
                .focusDistance(focusDistance)
                .shutterSpeed(shutterSpeed)
                .iso(iso)
                .latitude(latitude)
                .longitude(longitude)
                .photo(photo)
                .build();
    }

}
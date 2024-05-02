package org.ssafy.d103.communities.entity.photo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Metadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metadata_id")
    private Long id;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = false)
    private String cameraType;

    @Column
    private String cameraModel;

    @Column
    private String lensModel;

    @Column(nullable = false)
    private String aperture;

    @Column(nullable = false)
    private String focusDistance;

    @Column(nullable = false)
    private String shutterSpeed;

    @Column(nullable = false)
    private String iso;

    @Column
    private double latitude;

    @Column
    private double longitude;

    @OneToOne
    @JoinColumn(name = "photo_id")
    private Photo photo;

}
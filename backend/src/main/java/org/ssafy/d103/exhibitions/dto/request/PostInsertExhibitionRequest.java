package org.ssafy.d103.exhibitions.dto.request;

import lombok.Getter;
import org.ssafy.d103.exhibitions.dto.ExhibitionPhotoIdDto;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PostInsertExhibitionRequest {

    private Long posterId;
    private String title;
    private String description;
    private LocalDateTime endDate;
    private List<ExhibitionPhotoIdDto> photoList;

}

package org.ssafy.d103.exhibitions.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.ssafy.d103.exhibitions.entity.Exhibitions;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ExhibitionDto {

    private Long exhibitionId;
    private String title;
    private String posterUrl;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Builder
    private ExhibitionDto(Long exhibitionId, String title, String posterUrl, LocalDateTime startDate, LocalDateTime endDate) {
        this.exhibitionId = exhibitionId;
        this.title = title;
        this.posterUrl = posterUrl;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public static ExhibitionDto from(Exhibitions exhibition) {
        return builder()
                .exhibitionId(exhibition.getId())
                .title(exhibition.getTitle())
                .posterUrl(exhibition.getPosterUrl())
                .startDate(exhibition.getCreatedAt())
                .endDate(exhibition.getEndDate())
                .build();
    }
}

package org.ssafy.d103.exhibitions.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.repository.PhotoRepository;
import org.ssafy.d103.exhibitions.dto.ExhibitionPhotoIdDto;
import org.ssafy.d103.exhibitions.dto.request.PostInsertExhibitionRequest;
import org.ssafy.d103.exhibitions.dto.response.GetSelectMyExhibitionListResponse;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;
import org.ssafy.d103.exhibitions.entity.Exhibitions;
import org.ssafy.d103.exhibitions.repository.ExhibitionPhotoRepository;
import org.ssafy.d103.exhibitions.repository.ExhibitionRepository;
import org.ssafy.d103.members.entity.Members;

import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class ExhibitionService {

    private final ExhibitionRepository exhibitionRepository;
    private final ExhibitionPhotoRepository exhibitionPhotoRepository;
    private final PhotoRepository photoRepository;
    private final CommonService commonService;

    @Transactional
    public Boolean insertExhibition(Authentication authentication, PostInsertExhibitionRequest request) {

        Members member = commonService.findMemberByAuthentication(authentication);
        String posterUrl = photoRepository.findById(request.getPosterId())
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION)).getImageUrl();

        Exhibitions exhibition = Exhibitions.builder()
                .memberId(member)
                .posterUrl(posterUrl)
                .title(request.getTitle())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .build();
        exhibitionRepository.save(exhibition);

        List<ExhibitionPhoto> exhibitionPhotoList = new ArrayList<>();
        int cnt = 0;
        for(ExhibitionPhotoIdDto e: request.getPhotoList()) {
            exhibitionPhotoList.add(
                    ExhibitionPhoto.builder()
                            .exhibitionId(exhibition)
                            .photoId(e.getPhotoId())
                            .number(cnt++)
                            .build());
        }
        exhibitionPhotoRepository.saveAll(exhibitionPhotoList);

        return true;
    }

    public GetSelectMyExhibitionListResponse selectMyExhibitionList(Authentication authentication) {

        Members member = commonService.findMemberByAuthentication(authentication);
        List<Exhibitions> exhibitionList = exhibitionRepository.findExhibitionsByMemberId(member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));
        return GetSelectMyExhibitionListResponse.from(exhibitionList);
    }

}

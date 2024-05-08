package org.ssafy.d103.exhibitions.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.repository.photo.PhotoRepository;
import org.ssafy.d103.exhibitions.dto.ExhibitionCommentDto;
import org.ssafy.d103.exhibitions.dto.ExhibitionPhotoDto;
import org.ssafy.d103.exhibitions.dto.ExhibitionPhotoIdDto;
import org.ssafy.d103.exhibitions.dto.request.PostExhibitionCommentRequest;
import org.ssafy.d103.exhibitions.dto.request.PostInsertExhibitionRequest;
import org.ssafy.d103.exhibitions.dto.request.PutExhibitionLikeRequest;
import org.ssafy.d103.exhibitions.dto.response.*;
import org.ssafy.d103.exhibitions.entity.ExhibitionComment;
import org.ssafy.d103.exhibitions.entity.ExhibitionLike;
import org.ssafy.d103.exhibitions.entity.ExhibitionPhoto;
import org.ssafy.d103.exhibitions.entity.Exhibitions;
import org.ssafy.d103.exhibitions.repository.ExhibitionCommentRepository;
import org.ssafy.d103.exhibitions.repository.ExhibitionLikeRepository;
import org.ssafy.d103.exhibitions.repository.ExhibitionPhotoRepository;
import org.ssafy.d103.exhibitions.repository.ExhibitionRepository;
import org.ssafy.d103.follows.entity.Follows;
import org.ssafy.d103.follows.repository.FollowRepository;
import org.ssafy.d103.members.entity.Members;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class ExhibitionService {

    private final ExhibitionRepository exhibitionRepository;
    private final ExhibitionPhotoRepository exhibitionPhotoRepository;
    private final ExhibitionCommentRepository exhibitionCommentRepository;
    private final ExhibitionLikeRepository exhibitionLikeRepository;
    private final FollowRepository followRepository;
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
        for (ExhibitionPhotoIdDto e : request.getPhotoList()) {
            exhibitionPhotoList.add(
                    ExhibitionPhoto.builder()
                            .exhibitionId(exhibition)
                            .photoId(photoRepository.findById(e.getPhotoId())
                                    .orElseThrow(() -> new CustomException(ErrorType.ANOTHER_ERROR)))
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

    public GetSelectExhibitionResponse selectExhibition(Long exhibitionId) {

        Exhibitions exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));
        return GetSelectExhibitionResponse.from(exhibition);
    }

    public List<ExhibitionCommentDto> selectExhibitionCommentList(Long exhibitionId) {

        Exhibitions exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));

        List<ExhibitionComment> exhibitionCommentList = exhibitionCommentRepository.findAllByExhibitionId(exhibition)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION_COMMENT));

        return exhibitionCommentList.stream().map(ExhibitionCommentDto::from).collect(Collectors.toList());
    }

    public GetSelectExhibitionPhotoListResponse selectExhibitionPhotoList(Long exhibitionId) {

        Exhibitions exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));

        List<ExhibitionPhoto> exhibitionPhotoList = exhibitionPhotoRepository.findAllByExhibitionId(exhibition)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION_PHOTO));

        return GetSelectExhibitionPhotoListResponse.from(
                exhibitionPhotoList
                        .stream()
                        .map(ExhibitionPhotoDto::from)
                        .collect(Collectors.toList())
        );
    }

    @Transactional
    public PutExhibitionLikeResponse updateLike(Authentication authentication, PutExhibitionLikeRequest request) {

        Members member = commonService.findMemberByAuthentication(authentication);

        Exhibitions exhibition = exhibitionRepository.findById(request.getExhibitionId())
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));

        ExhibitionLike exhibitionLike = exhibitionLikeRepository.findAllByMemberIdAndExhibitionId(member, exhibition)
                .orElse(null);

        boolean flag = false;
        if (exhibitionLike == null) {
            exhibitionLikeRepository.save(
                    ExhibitionLike
                            .builder()
                            .exhibitionId(exhibition)
                            .memberId(member)
                            .build()
            );

            exhibition.updateLikeCnt(exhibition.getLikeCnt() + 1);
            exhibitionRepository.save(exhibition);
            flag = true;
        } else {
            exhibitionLikeRepository.delete(exhibitionLike);
            exhibition.updateLikeCnt(exhibition.getLikeCnt() - 1);
            exhibitionRepository.save(exhibition);
        }

        return PutExhibitionLikeResponse.of(flag, exhibition);
    }

    @Transactional
    public List<ExhibitionCommentDto> saveExhibitionComment(Authentication authentication, PostExhibitionCommentRequest request) {

        Members member = commonService.findMemberByAuthentication(authentication);

        Exhibitions exhibition = exhibitionRepository.findById(request.getExhibitionId())
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));

        exhibitionCommentRepository.save(
                ExhibitionComment
                        .builder()
                        .exhibitionId(exhibition)
                        .memberId(member)
                        .comment(request.getComment())
                        .build()
        );

        return selectExhibitionCommentList(request.getExhibitionId());
    }

    public GetExhibitionListResponse selectExhibitionList(Authentication authentication) {

        Members member = commonService.findMemberByAuthentication(authentication);

        List<Follows> followList = followRepository.findFollowsByFollowerId(member)
                .orElse(null);
        log.warn("{}", followList.size());

        List<Exhibitions> exhibitionList = exhibitionRepository.findAllExhibitions()
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_EXHIBITION));

        List<Exhibitions> followExhibitionList = new ArrayList<>();

        for (Exhibitions e : exhibitionList) {
            for (Follows f : followList) {
                log.warn("{} vs {}", e.getMemberId().getId(), f.getFollowingId().getId());
                if (e.getMemberId().getId() == f.getFollowingId().getId()) {
                    followExhibitionList.add(e);
                }
            }
        }

        return GetExhibitionListResponse.from(followExhibitionList, exhibitionList);
    }
}

package org.ssafy.d103.follows.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.follows.dto.FollowerDto;
import org.ssafy.d103.follows.dto.FollowingDto;
import org.ssafy.d103.follows.entity.Follows;
import org.ssafy.d103.follows.repository.FollowRepository;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;
    private final CommonService commonService;

    @Transactional
    public boolean followMember(Authentication authentication, Long memberId) {

        Members member = commonService.findMemberByAuthentication(authentication);
        Members target = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_MEMBER));

        boolean check = followRepository.findAllByFollowerIdAndFollowingId(member, target)
                .isPresent();

        if(check) {
            throw new CustomException(ErrorType.ALREADY_FOLLOWING);
        }

        Follows follow = Follows.builder()
                    .followingId(target)
                    .followerId(member)
                    .build();
        followRepository.save(follow);

        member.updateFollowCnt(member.getFollowerCnt(), member.getFollowingCnt()+1);
        target.updateFollowCnt(target.getFollowerCnt()+1, target.getFollowingCnt());
        memberRepository.save(member);
        memberRepository.save(target);

        return true;
    }

    @Transactional
    public boolean unfollowMember(Authentication authentication, Long memberId) {

        Members member = commonService.findMemberByAuthentication(authentication);
        Members target = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_MEMBER));

        Follows follow = followRepository.findAllByFollowerIdAndFollowingId(member, target)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_FOLLOW));

        followRepository.delete(follow);

        member.updateFollowCnt(member.getFollowerCnt(), member.getFollowingCnt()-1);
        target.updateFollowCnt(target.getFollowerCnt()-1, target.getFollowingCnt());
        memberRepository.save(member);
        memberRepository.save(target);

        return false;
    }

    public List<FollowingDto> selectFollowList(Authentication authentication) {

        Members member = commonService.findMemberByAuthentication(authentication);
        List<Follows> followsList = followRepository.findFollowsByFollowerId(member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_FOLLOW));

        return followsList.stream().map(FollowingDto::from).collect(Collectors.toList());
    }

    public List<FollowerDto> selectFollowerList(Authentication authentication) {

        Members member = commonService.findMemberByAuthentication(authentication);
        List<Follows> followsList = followRepository.findFollowsByFollowingId(member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_FOLLOW));

        return followsList.stream().map(FollowerDto::from).collect(Collectors.toList());
    }
}

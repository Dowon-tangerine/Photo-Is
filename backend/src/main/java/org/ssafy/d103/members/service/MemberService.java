package org.ssafy.d103.members.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103.members.dto.request.PostMemberRequest;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public String saveMember(PostMemberRequest request) {
        Members member = memberRepository.findMembersByEmailAndDeletedAtIsNull(request.getEmail())
                .orElse(null);

        // 이미 가입한 사용자
        if(member != null) {
            throw new CustomException(ErrorType.DUPLICATED_MEMBER);
        }

        // 처음 가입한 사용자
        memberRepository.save(
                Members.of(
                        request.getEmail(),
                        request.getPassword(),
                        request.getNickname(),
                        request.getBirthYear(),
                        request.getUseYear()
                )
        );

        return null;
    }
}

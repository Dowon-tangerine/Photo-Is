package org.ssafy.d103._common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103.members.dto.SecurityMemberDto;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommonService {

    private final MemberRepository memberRepository;

    public Members findMemberByAuthentication(Authentication authentication) {
        Object principalObject = authentication.getPrincipal();

        if (principalObject instanceof SecurityMemberDto securityMemberDto) {

            Optional<Members> optionalMember = findMemberById(securityMemberDto.getId());

            if (optionalMember.isPresent()) {
                return optionalMember.get();
            }
        }

        throw new CustomException(ErrorType.NOT_FOUND_MEMBER);

    }

    private Optional<Members> findMemberById(Long memberId) {
        return memberRepository.findById(memberId);
    }
}

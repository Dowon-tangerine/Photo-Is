package org.ssafy.d103.members.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Members member = memberRepository.findMembersByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorType.NOT_FOUND_MEMBER.getMsg()));
        return new UserDetailsImpl(member);
    }
}

package org.ssafy.d103.members.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.ssafy.d103.members.entity.Members;

@Getter
@ToString
public class SecurityMemberDto {

    private Long id;
    private String email;
    private String nickname;

    @Builder
    private SecurityMemberDto(Long id, String email, String nickname) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
    }

    public static SecurityMemberDto from(Members member) {
        return builder()
                .id(member.getId())
                .email(member.getEmail())
                .nickname(member.getNickname())
                .build();
    }
}

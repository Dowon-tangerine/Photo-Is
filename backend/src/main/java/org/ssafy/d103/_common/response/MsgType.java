package org.ssafy.d103._common.response;

import lombok.Getter;

@Getter
public enum MsgType {

    TEST_MSG("테스트 메시지"),

    //********************************[ Members ]********************************
    SIGNUP_SUCCESSFULLY("회원가입에 성공하였습니다."),
    SIGN_IN_SUCCESSFULLY("로그인에 성공하였습니다."),
    VALIDATE_NICKNAME_SUCCESSFULLY("닉네임 중복 검사에 성공하였습니다."),
    VALIDATE_EMAIL_SUCCESSFULLY("이메일 중복 검사에 성공하였습니다."),
    ;

    private final String msg;

    MsgType(String msg) {
        this.msg = msg;
    }
}

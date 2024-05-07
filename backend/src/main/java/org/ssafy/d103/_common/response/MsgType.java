package org.ssafy.d103._common.response;

import lombok.Getter;

@Getter
public enum MsgType {

    TEST_MSG("테스트 메시지"),

    //********************************[ Members ]********************************
    SIGNUP_SUCCESSFULLY("회원가입에 성공하였습니다."),
    SIGN_IN_SUCCESSFULLY("로그인에 성공하였습니다."),
    VALIDATE_NICKNAME_SUCCESSFULLY("닉네임 중복검사에 성공하였습니다."),
    VALIDATE_EMAIL_SUCCESSFULLY("이메일 중복검사에 성공하였습니다."),
    UPDATE_MEMBER_SUCCESSFULLY("회원정보 수정에 성공하였습니다."),
    VALIDATE_PASSWORD_SUCCESSFULLY("비밀번호 확인에 성공하였습니다."),
    SELECT_MEMBER_SUCCESSFULLY("멤버정보 조회에 성공하였습니다."),
    SELECT_MEMBER_LIST_SUCCESSFULLY("멤버목록 조회에 성공하였습니다."),
    UPDATE_BACKGROUND_IMG_SUCCESSFULLY("배경화면 변경에 성공하였습니다."),

    //********************************[ Follows ]********************************
    UPDATE_FOLLOW_SUCCESSFULLY("팔로우 상태 변경에 성공하였습니다."),
    SELECT_FOLLOW_LIST_SUCCESSFULLY("팔로우 목록 조회에 성공하였습니다."),
    SELECT_FOLLOWER_LIST_SUCCESSFULLY("팔로워 목록 조회에 성공하였습니다."),

    //********************************[ Exhibitions ]********************************
    INSERT_EXHIBITION_SUCCESSFULLY("전시회 등록에 성공하였습니다."),
    SELECT_EXHIBITION_LIST_SUCCESSFULLY("전시회 전체목록 조회에 성공하였습니다."),
    SELECT_MY_EXHIBITION_LIST_SUCCESSFULLY("내 전시회 전체목록 조회에 성공하였습니다."),
    SELECT_EXHIBITION_SUCCESSFULLY("전시회 상세정보 조회에 성공하였습니다."),
    SELECT_EXHIBITION_COMMENT_LIST_SUCCESSFULLY("전시회 한줄평 목록 조회에 성공하였습니다."),
    SELECT_EXHIBITION_PHOTO_LIST_SUCCESSFULLY("전시회 사진 목록 조회에 성공하였습니다."),

    //********************************[ Photos ]********************************
    PHOTO_UPLOAD_SUCCESSFULLY("사진 업로드에 성공하였습니다.")
    ;

    private final String msg;

    MsgType(String msg) {
        this.msg = msg;
    }
}
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

    //********************************[ Photos ]********************************
    PHOTO_UPLOAD_SUCCESSFULLY("사진 업로드에 성공하였습니다."),
    PHOTO_MODIFY_SUCCESSFULLY("사진 정보 변경에 성공하였습니다."),
    PHOTO_DELETE_SUCCESSFULLY("사진 삭제에 성공하였습니다."),
    PHOTO_GET_SUCCESSFULLY("사진 조회에 성공하였습니다."),
    PHOTO_LIKE_CHANGE_SUCCESSFULLY("사진 좋아요 변경에 성공하였습니다."),
    PHOTO_COMMENT_WRITE_SUCCESSFULLY("댓글 작성에 성공하였습니다."),
    ;

    private final String msg;

    MsgType(String msg) {
        this.msg = msg;
    }
}
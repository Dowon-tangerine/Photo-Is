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
    UPDATE_EXHIBITION_LIKE_SUCCESSFULLY("전시회 좋아요 상태 변경에 성공하였습니다."),
    INSERT_EXHIBITION_COMMENT_SUCCESSFULLY("전시회 한줄평 작성에 성공하였습니다."),

    //********************************[ Photos ]********************************
    PHOTO_UPLOAD_SUCCESSFULLY("사진 업로드에 성공하였습니다."),
    PHOTO_STUDIO_METADATA_SAVE_SUCCESSFULLY("스튜디오 사진 메타데이터 저장에 성공하였습니다."),
    PHOTO_MODIFY_SUCCESSFULLY("사진 정보 변경에 성공하였습니다."),
    PHOTO_DELETE_SUCCESSFULLY("사진 삭제에 성공하였습니다."),
    PHOTO_GET_SUCCESSFULLY("사진 조회에 성공하였습니다."),
    MY_PHOTO_GET_SUCCESSFULLY("내 사진 조회에 성공하였습니다."),
    OTHERS_PHOTO_GET_SUCCESSFULLY("타인 사진 조회에 성공하였습니다."),
    PHOTO_LIKE_CHANGE_SUCCESSFULLY("사진 좋아요 변경에 성공하였습니다."),
    PHOTO_COMMENT_WRITE_SUCCESSFULLY("사진 댓글 작성에 성공하였습니다."),
    PHOTO_COMMENT_LIST_GET_SUCCESSFULLY("사진 댓글 조회에 성공하였습니다."),
    PHOTO_COMMENT_DELETE_SUCCESSFULLY("사진 댓글 삭제에 성공하였습니다."),
    SEARCH_RESULT_LIST_GET_SUCCESSFULLY("통합 검색 결과 조회에 성공하였습니다."),
    PHOTO_RANKING_GET_SUCCESSFULLY("사진 랭킹 조회에 성공하였습니다."),

    //********************************[ Questions ]********************************
    QUESTION_UPLOAD_SUCCESSFULLY("질문 업로드에 성공하였습니다."),
    QUESTION_LIST_GET_SUCCESSFULLY("질문 목록 조회에 성공하였습니다."),
    QUESTION_LIST_BY_CATEGORY_GET_SUCCESSFULLY("카테고리별 질문 목록 조회에 성공하였습니다."),
    QUESTION_DETAIL_GET_SUCCESSFULLY("질문 목록 조회에 성공하였습니다."),
    QUESTION_MODIFY_SUCCESSFULLY("질문 수정에 성공하였습니다."),
    QUESTION_DELETE_SUCCESSFULLY("질문 삭제에 성공하였습니다."),
    QUESTION_COMMENT_WRITE_SUCCESSFULLY("질문 댓글 작성에 성공하였습니다."),
    QUESTION_COMMENT_LIST_GET_SUCCESSFULLY("질문 댓글 조회에 성공하였습니다."),
    QUESTION_COMMENT_DELETE_SUCCESSFULLY("질문 댓글 삭제에 성공하였습니다."),
    SEARCH_QUESTION_LIST_GET_SUCCESSFULLY("검색 결과 조회에 성공하였습니다."),
    ;

    private final String msg;

    MsgType(String msg) {
        this.msg = msg;
    }
}
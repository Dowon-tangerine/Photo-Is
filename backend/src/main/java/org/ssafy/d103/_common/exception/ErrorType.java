package org.ssafy.d103._common.exception;

import lombok.Getter;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;

@Getter
public enum ErrorType {

    //-----------------------BAD_REQUEST-----------------------------
    BAD_REQUEST(400, "잘못된 요청입니다."),

    //********************************[ Members ]********************************
    DUPLICATED_MEMBER(400, "가입 정보가 존재합니다."),
    DUPLICATED_NICKNAME(400, "중복된 닉네임입니다."),
    DUPLICATED_EMAIL(400, "중복된 이메일입니다."),
    INVALID_TOKEN(400, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(400, "만료된 토큰입니다."),
    TOKEN_NOT_FOUND(404, "토큰이 존재하지 않습니다."),
    NOT_FOUND_MEMBER(404, "멤버가 존재하지 않습니다."),
    INVALID_PASSWORD(400, "비밀번호가 일치하지 않습니다."),

    //********************************[ Follows ]********************************
    ALREADY_FOLLOWING(400, "이미 팔로잉 중입니다."),
    NOT_FOUND_FOLLOW(404, "팔로우 정보가 존재하지 않습니다."),

    //********************************[ Exhibitions ]********************************
    NOT_FOUND_EXHIBITION(404, "전시회가 존재하지 않습니다."),
    NOT_FOUND_EXHIBITION_COMMENT(404, "전시회 한줄평이 존재하지 않습니다."),
    NOT_FOUND_EXHIBITION_PHOTO(404, "전시회 사진이 존재하지 않습니다."),

    //********************************[ ETC ]********************************
    ANOTHER_ERROR(401, "기타 에러가 발생하였습니다."),
    DB_SAVE_ERROR(500, "DB 저장중 오류가 발생하였습니다.");

    private final int code;
    private final String msg;

    ErrorType(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static <T> ApiResponseDto<T> of(MsgType msgType, T result) {
        return ApiResponseDto.<T>builder()
                .msg(msgType.getMsg())
                .data(result)
                .build();
    }

    public static <T> ApiResponseDto<T> of(ErrorResponse errorResponse, MsgType msgType, T result) {
        return ApiResponseDto.<T>builder()
                .errorResponse(errorResponse)
                .msg(msgType.getMsg())
                .data(result)
                .build();
    }
}
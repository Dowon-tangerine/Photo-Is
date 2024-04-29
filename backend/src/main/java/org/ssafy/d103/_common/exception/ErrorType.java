package org.ssafy.d103._common.exception;

import lombok.Getter;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.MsgType;

@Getter
public enum ErrorType {

    //-----------------------BAD_REQUEST-----------------------------
    BAD_REQUEST(400, "잘못된 요청입니다."),

    //********************************[ Members ]********************************
    DUPLICATED_MEMBER(400,"가입 정보가 존재합니다."),
    ;

    private final int code;
    private final String msg;
    ErrorType(int code, String msg){
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

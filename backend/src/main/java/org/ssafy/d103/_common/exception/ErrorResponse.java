package org.ssafy.d103._common.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ErrorResponse {

    private final int status;
    private final String msg;

    @Builder
    private ErrorResponse(int status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    public static ErrorResponse of (ErrorType errorType) {
        return ErrorResponse.builder()
                .status(errorType.getCode())
                .msg(errorType.getMsg())
                .build();
    }

    public static ErrorResponse of (String msg) {
        return ErrorResponse.builder()
                .status(400)
                .msg(msg)
                .build();
    }
}

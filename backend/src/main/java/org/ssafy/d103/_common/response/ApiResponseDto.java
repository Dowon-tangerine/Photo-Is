package org.ssafy.d103._common.response;

import lombok.Builder;
import lombok.Getter;
import org.ssafy.d103._common.exception.ErrorResponse;

@Getter
public class ApiResponseDto<T> {

    private final T data;
    private final String msg;
    private final ErrorResponse errorResponse;

    @Builder
    public ApiResponseDto(T data, String msg, ErrorResponse errorResponse) {
        this.data = data;
        this.msg = msg;
        this.errorResponse = errorResponse;
    }
}

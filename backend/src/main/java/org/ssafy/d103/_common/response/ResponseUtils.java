package org.ssafy.d103._common.response;

import org.ssafy.d103._common.exception.ErrorResponse;
import org.ssafy.d103._common.exception.ErrorType;

public class ResponseUtils {

    /**
     * 돌려줄 데이터가 있을 때 사용
     */
    public static <T> ApiResponseDto<T> ok (T data, MsgType msg) {
        return ApiResponseDto.<T> builder()
                .data(data)
                .msg(msg.getMsg())
                .build();
    }

    /**
     * 돌려줄 데이터가 없을 때 사용
     */
    public static ApiResponseDto<Void> ok (MsgType msg) {
        return ApiResponseDto.<Void> builder()
                .msg(msg.getMsg())
                .build();
    }
    /**
     * 에러 발생시 사용
     */
    public static ApiResponseDto<Void> fail (ErrorType msg) {
        return ApiResponseDto.<Void> builder()
                .errorResponse(
                        ErrorResponse.builder()
                                .status(msg.getCode())
                                .msg(msg.getMsg())
                                .build()
                )
                .build();
    }
}

package org.ssafy.d103._common.response;

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
}

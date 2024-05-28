package org.ssafy.d103._common.exception;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.ssafy.d103._common.response.ApiResponseDto;
import org.ssafy.d103._common.response.ResponseUtils;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ApiResponseDto<?> handleGlobalException(CustomException customException) {
        return ResponseUtils.fail(customException.getErrorType());
    }
}

package org.ssafy.d103._common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomException extends RuntimeException {

    private final ErrorType errorType;

    @Override
    public String getMessage() {
        return errorType.getMsg();
    }

    public CustomException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }
}

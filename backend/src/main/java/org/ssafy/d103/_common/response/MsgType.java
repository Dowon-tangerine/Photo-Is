package org.ssafy.d103._common.response;

import lombok.Getter;

@Getter
public enum MsgType {

    TEST_MSG("테스트 메시지"),
    ;

    private final String msg;

    MsgType(String msg) {
        this.msg = msg;
    }
}

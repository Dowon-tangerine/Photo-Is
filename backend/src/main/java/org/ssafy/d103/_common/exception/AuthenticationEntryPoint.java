package org.ssafy.d103._common.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.ssafy.d103._common.response.ResponseUtils;

import java.io.IOException;
import java.util.Enumeration;

@Component
@Slf4j
public class AuthenticationEntryPoint implements org.springframework.security.web.AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        String exception = (String) request.getAttribute("exception");
        log.error(request.getRequestURI());

        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()){
            String name = headerNames.nextElement();
            String value = request.getHeader(name);
            log.info("header: {}  value: {}", name, value);
        }

        if(exception != null) {
            if (ErrorType.valueOf(exception).equals(ErrorType.TOKEN_NOT_FOUND)) {
                exceptionHandler(response, ErrorType.TOKEN_NOT_FOUND);
                return;
            }
            if (ErrorType.valueOf(exception).equals(ErrorType.INVALID_TOKEN)) {
                exceptionHandler(response, ErrorType.INVALID_TOKEN);
                return;
            }
            if(ErrorType.valueOf(exception).equals(ErrorType.EXPIRED_TOKEN)) {
                exceptionHandler(response, ErrorType.EXPIRED_TOKEN);
                return;
            }
            if (ErrorType.valueOf(exception).equals(ErrorType.NOT_FOUND_MEMBER)) {
                exceptionHandler(response, ErrorType.NOT_FOUND_MEMBER);
            }
        } else {
            exceptionHandler(response, ErrorType.ANOTHER_ERROR);
        }
    }

    public void exceptionHandler(HttpServletResponse response, ErrorType error) {
        response.setStatus(error.getCode());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            String json = new ObjectMapper().writeValueAsString(ResponseUtils.fail(error));
            response.getWriter().write(json);
            log.error(" 에러 내용={}", error.getMsg());
        } catch (Exception e){
            log.error(e.getMessage());
        }
    }
}

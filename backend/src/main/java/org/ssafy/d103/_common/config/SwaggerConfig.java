package org.ssafy.d103._common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "PhotoIs API Docs",
                description = "PhotoIs의 API 문서입니다.",
                version = "v1"
        ),
        servers = {
                @Server(url = "http://localhost:8081", description = "Local Server")
                //@Server(url = "https://k10d103.p.ssafy.io", description = "Deployed Server")
        }
)
@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {


}

package org.ssafy.d103.chatbots.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TagResponseDto {
    private List<String> tags;
}
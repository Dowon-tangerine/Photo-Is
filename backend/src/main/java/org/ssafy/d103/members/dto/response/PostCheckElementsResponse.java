package org.ssafy.d103.members.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCheckElementsResponse {

    Boolean isValid;

    @Builder
    public PostCheckElementsResponse(Boolean isValid){
        this.isValid = isValid;
    }
}

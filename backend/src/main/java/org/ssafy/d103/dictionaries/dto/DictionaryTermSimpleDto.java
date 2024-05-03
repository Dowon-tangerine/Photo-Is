package org.ssafy.d103.dictionaries.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
// 카테고리에 해당하는 용어 이름과 ID만 간단히 반환하는 Dto
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryTermSimpleDto {
    private Long termId;
    private String term;
}
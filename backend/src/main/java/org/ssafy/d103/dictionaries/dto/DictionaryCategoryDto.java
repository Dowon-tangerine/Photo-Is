package org.ssafy.d103.dictionaries.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryCategoryDto {
    private Long categoryId;
    private String categoryName;
    private List<DictionaryTermSimpleDto> terms;
}
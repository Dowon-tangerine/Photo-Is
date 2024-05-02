package org.ssafy.d103.dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryCategoryDto {
    private Long id;
    private String categoryName;
    private List<DictionaryTermSimpleDto> terms;
}
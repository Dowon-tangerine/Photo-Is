package org.ssafy.d103.dictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryTermSimpleDto {
    private Long id;
    private String term;
}
package org.ssafy.d103.dictionaries.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryTermDto {
    private Long termId;
    private String term;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
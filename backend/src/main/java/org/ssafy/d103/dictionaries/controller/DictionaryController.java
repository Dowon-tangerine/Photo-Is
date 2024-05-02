package org.ssafy.d103.dictionaries.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.ssafy.d103.dictionaries.dto.DictionaryCategoryDto;
import org.ssafy.d103.dictionaries.dto.DictionaryTermDto;
import org.ssafy.d103.dictionaries.service.DictionaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "dictionaries", description = "사전 관련 API")
@RestController
@RequestMapping("/api/docs")
@RequiredArgsConstructor
public class DictionaryController {

    private final DictionaryService dictionaryService;

    @Operation(summary = "사전 카테고리 리스트 및 용어 조회",
            description = "사전 카테고리 리스트와 해당 카테고리의 이름 및 ID를 반환합니다."
    )
    @GetMapping("/categories")
    public ResponseEntity<List<DictionaryCategoryDto>> getAllCategoriesWithTermTitles() {
        List<DictionaryCategoryDto> categories = dictionaryService.findAllCategoriesWithTermTitles();
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "용어 상세 조회",
            description = "용어 ID에 대한 용어 상세 내용을 반환합니다."
    )
    @GetMapping("/terms/{term-id}")
    public ResponseEntity<DictionaryTermDto> getTermById(@PathVariable("term-id") Long termId) {
        DictionaryTermDto termDto = dictionaryService.findTermById(termId);
        return termDto != null ? ResponseEntity.ok(termDto) : ResponseEntity.notFound().build();
    }
}

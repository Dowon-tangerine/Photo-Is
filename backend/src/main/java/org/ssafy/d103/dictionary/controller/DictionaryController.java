package org.ssafy.d103.dictionary.controller;

import lombok.RequiredArgsConstructor;
import org.ssafy.d103.dictionary.dto.DictionaryCategoryDto;
import org.ssafy.d103.dictionary.dto.DictionaryTermDto;
import org.ssafy.d103.dictionary.service.DictionaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
@RequiredArgsConstructor
public class DictionaryController {

    private final DictionaryService dictionaryService;

    @GetMapping("/categories")
    public ResponseEntity<List<DictionaryCategoryDto>> getAllCategoriesWithTermTitles() {
        List<DictionaryCategoryDto> categories = dictionaryService.findAllCategoriesWithTermTitles();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/terms/{termId}")
    public ResponseEntity<DictionaryTermDto> getTermById(@PathVariable Long termId) {
        DictionaryTermDto termDto = dictionaryService.findTermById(termId);
        return termDto != null ? ResponseEntity.ok(termDto) : ResponseEntity.notFound().build();
    }
}

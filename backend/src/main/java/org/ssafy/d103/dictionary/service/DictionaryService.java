package org.ssafy.d103.dictionary.service;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.d103.dictionary.dto.DictionaryCategoryDto;
import org.ssafy.d103.dictionary.dto.DictionaryTermDto;
import org.ssafy.d103.dictionary.dto.DictionaryTermSimpleDto;
import org.ssafy.d103.dictionary.repository.DictionaryCategoryRepository;
import org.ssafy.d103.dictionary.repository.DictionaryTermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DictionaryService {

    private final DictionaryCategoryRepository categoryRepository;
    private final DictionaryTermRepository termRepository;

    public List<DictionaryCategoryDto> findAllCategoriesWithTermTitles() {
        return categoryRepository.findAllWithTerms().stream()
                .map(category -> new DictionaryCategoryDto(
                        category.getId(),
                        category.getCategoryName(),
                        category.getTerms().stream()
                                .map(term -> new DictionaryTermSimpleDto(term.getId(), term.getTerm()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public DictionaryTermDto findTermById(Long termId) {
        return termRepository.findById(termId)
                .map(term -> new DictionaryTermDto(term.getId(), term.getTerm(), term.getDescription(),term.getCreatedAt(),term.getUpdatedAt()))
                .orElse(null);
    }
}

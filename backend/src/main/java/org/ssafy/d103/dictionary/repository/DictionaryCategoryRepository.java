package org.ssafy.d103.dictionary.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.ssafy.d103.dictionary.entity.DictionaryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DictionaryCategoryRepository extends JpaRepository<DictionaryCategory, Long> {
    @EntityGraph(attributePaths = {"terms"})
    List<DictionaryCategory> findAllWithTerms();
}
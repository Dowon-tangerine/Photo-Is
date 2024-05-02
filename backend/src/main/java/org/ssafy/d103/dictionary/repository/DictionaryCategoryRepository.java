package org.ssafy.d103.dictionary.repository;

import org.springframework.data.jpa.repository.Query;
import org.ssafy.d103.dictionary.entity.DictionaryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DictionaryCategoryRepository extends JpaRepository<DictionaryCategory, Long> {
    @Query("SELECT c FROM DictionaryCategory c JOIN FETCH c.terms")
    List<DictionaryCategory> findAllWithTerms();
}
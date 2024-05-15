package org.ssafy.d103.dictionaries.repository;

import org.springframework.data.jpa.repository.Query;
import org.ssafy.d103.dictionaries.entity.DictionaryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DictionaryCategoryRepository extends JpaRepository<DictionaryCategory, Long> {
    @Query("SELECT c FROM DictionaryCategory c JOIN FETCH c.terms")
    List<DictionaryCategory> findAllWithTerms();
}
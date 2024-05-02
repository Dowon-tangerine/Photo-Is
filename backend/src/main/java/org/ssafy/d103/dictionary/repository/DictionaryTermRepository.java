package org.ssafy.d103.dictionary.repository;

import org.ssafy.d103.dictionary.entity.DictionaryTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DictionaryTermRepository extends JpaRepository<DictionaryTerm, Long> {
    List<DictionaryTerm> findByCategoryId(Long categoryId);
}
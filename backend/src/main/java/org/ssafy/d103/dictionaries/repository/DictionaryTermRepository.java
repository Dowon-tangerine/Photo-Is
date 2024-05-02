package org.ssafy.d103.dictionaries.repository;

import org.ssafy.d103.dictionaries.entity.DictionaryTerm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryTermRepository extends JpaRepository<DictionaryTerm, Long> {
}
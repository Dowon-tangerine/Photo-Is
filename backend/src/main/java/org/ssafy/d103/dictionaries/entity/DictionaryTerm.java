package org.ssafy.d103.dictionaries.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.CreatedAndDeletedTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "dictionary_term")
public class DictionaryTerm extends CreatedAndDeletedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private DictionaryCategory category;

    @Column(nullable = false)
    private String term;

    @Column(nullable = false)
    private String description;

    @Builder
    public DictionaryTerm(DictionaryCategory category, String term, String description) {
        this.category = category;
        this.term = term;
        this.description = description;
    }
}

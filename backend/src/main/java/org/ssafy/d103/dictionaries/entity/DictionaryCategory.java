package org.ssafy.d103.dictionaries.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.d103._common.entity.CreatedAndDeletedTime;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "dictionary_category")
public class DictionaryCategory extends CreatedAndDeletedTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DictionaryTerm> terms;

    @Builder
    public DictionaryCategory(String categoryName) {
        this.categoryName = categoryName;
    }
}

package org.ssafy.d103.communities.dto.question;

import lombok.Builder;
import lombok.Getter;

@Getter
public class PaginationDataDto {

    private Integer currentPage;
    private Integer totalPages;
    private Integer totalItems;
    private Integer itemsPerPage;

    @Builder
    private PaginationDataDto(Integer currentPage, Integer totalPages, Integer totalItems, Integer itemsPerPage) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.itemsPerPage = itemsPerPage;
    }

    public static PaginationDataDto of(Integer currentPage, Integer totalPages, Integer totalItems, Integer itemsPerPage) {
        return builder()
                .currentPage(currentPage)
                .totalPages(totalPages)
                .totalItems(totalItems)
                .itemsPerPage(itemsPerPage)
                .build();
    }

}
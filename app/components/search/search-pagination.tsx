// components/search/SearchPagination.tsx
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '~/components/ui/pagination';

interface SearchPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * Builds the list of page numbers (and ellipsis markers) to show.
 * Always shows first, last, current, and up to 1 neighbour on each side.
 *
 * e.g. for totalPages=20, page=10 → [1, '...', 9, 10, 11, '...', 20]
 */
function buildPageItems(page: number, totalPages: number): (number | '...')[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | '...')[] = [];
    const addPage = (n: number) => items.push(n);
    const addEllipsis = () => {
        if (items[items.length - 1] !== '...') items.push('...');
    };

    addPage(1);

    if (page > 3) addEllipsis();

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        addPage(i);
    }

    if (page < totalPages - 2) addEllipsis();

    addPage(totalPages);

    return items;
}

export function SearchPagination({ page, totalPages, onPageChange }: SearchPaginationProps) {
    if (totalPages <= 1) return null;

    const pageItems = buildPageItems(page, totalPages);

    return (
        <div className="mt-12">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(page - 1)}
                            className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            aria-disabled={page <= 1}
                        />
                    </PaginationItem>

                    {pageItems.map((item, idx) =>
                        item === '...' ? (
                            <PaginationItem key={`ellipsis-${idx}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={item}>
                                <PaginationLink
                                    isActive={item === page}
                                    onClick={() => onPageChange(item)}
                                    className="cursor-pointer"
                                >
                                    {item}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(page + 1)}
                            className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            aria-disabled={page >= totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
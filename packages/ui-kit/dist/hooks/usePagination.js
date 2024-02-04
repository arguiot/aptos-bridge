import { useEffect, useRef, useState } from 'react';
export function usePagination(items, perPage = 8) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPagesCount = Math.ceil(items.length / perPage);
    const currentPageItems = items.slice((currentPage - 1) * perPage, currentPage * perPage);
    // reset to 1st page on change
    const lengthRef = useRef(items.length);
    useEffect(() => {
        if (lengthRef.current !== items.length) {
            setCurrentPage(1);
            lengthRef.current = items.length;
        }
    }, [items.length]);
    return {
        onNextPage: () => setCurrentPage(Math.min(currentPage + 1, totalPagesCount)),
        onPrevPage: () => setCurrentPage(Math.max(currentPage - 1, 1)),
        currentPage,
        currentPageItems,
        totalPagesCount,
    };
}

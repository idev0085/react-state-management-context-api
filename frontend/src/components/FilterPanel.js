import React, { useState, useCallback } from 'react';
import { filterItems, sortItems, paginateItems, getTotalPages } from '../helpers/itemUtils';

const FilterPanel = ({ items, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filtered = filterItems(items, searchTerm);
    const sorted = sortItems(filtered, sortBy, sortOrder);
    const totalPages = getTotalPages(sorted.length, pageSize);
    const paginated = paginateItems(sorted, currentPage, pageSize);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback((field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    }, [sortBy, sortOrder]);

    const handlePageSizeChange = useCallback((e) => {
        setPageSize(parseInt(e.target.value, 10));
        setCurrentPage(1);
    }, []);

    const handlePreviousPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, totalPages]);

    React.useEffect(() => {
        onFilter({
            items: paginated,
            searchTerm,
            sortBy,
            sortOrder,
            pageSize,
            currentPage,
            totalPages,
            totalItems: sorted.length,
        });
    }, [paginated, searchTerm, sortBy, sortOrder, pageSize, currentPage, totalPages, sorted.length, onFilter]);

    return (
        <div data-testid="filter-panel" className="filter-panel">
            <div className="search-container">
                <input
                    data-testid="search-input"
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            <div className="sort-controls">
                <button
                    data-testid="sort-by-name"
                    onClick={() => handleSort('name')}
                    className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
                >
                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                    data-testid="sort-by-id"
                    onClick={() => handleSort('id')}
                    className={`sort-btn ${sortBy === 'id' ? 'active' : ''}`}
                >
                    ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
            </div>

            <div className="pagination-controls">
                <button
                    data-testid="prev-page"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                >
                    Previous
                </button>
                <span data-testid="page-info" className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    data-testid="next-page"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>

            <div className="page-size">
                <label htmlFor="page-size">Items per page:</label>
                <select
                    id="page-size"
                    data-testid="page-size-select"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="page-size-select"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="filter-stats">
                <p data-testid="results-count">
                    Showing {paginated.length} of {sorted.length} items
                </p>
            </div>
        </div>
    );
};

export default FilterPanel;

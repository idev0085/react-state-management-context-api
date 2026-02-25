import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from '../FilterPanel';

const mockItems = [
    { id: 1, name: 'Apple', description: 'Fresh apple' },
    { id: 2, name: 'Banana', description: 'Yellow banana' },
    { id: 3, name: 'Cherry', description: 'Red cherry fruit' },
    { id: 4, name: 'Date', description: 'Sweet date' },
    { id: 5, name: 'Elderberry', description: 'Dark elderberry' },
    { id: 6, name: 'Fig', description: 'Purple fig' },
    { id: 7, name: 'Grape', description: 'Green grape' },
    { id: 8, name: 'Honeydew', description: 'Sweet honeydew' },
    { id: 9, name: 'Kiwi', description: 'Brown kiwi' },
    { id: 10, name: 'Lemon', description: 'Yellow lemon' },
    { id: 11, name: 'Mango', description: 'Orange mango' },
    { id: 12, name: 'Nectarine', description: 'Sweet nectarine' },
];

describe('FilterPanel', () => {
    describe('Rendering', () => {
        it('should render filter panel', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
        });

        it('should render search input', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('search-input')).toBeInTheDocument();
        });

        it('should render sort button', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('sort-name')).toBeInTheDocument();
        });

        it('should render pagination buttons', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('prev-btn')).toBeInTheDocument();
            expect(screen.getByTestId('next-btn')).toBeInTheDocument();
        });

        it('should render page info', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('page-info')).toBeInTheDocument();
        });

        it('should render page size select', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('page-size')).toBeInTheDocument();
        });

        it('should render results count', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('results-count')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        it('should filter items by name', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'Apple' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        items: [mockItems[0]],
                        searchTerm: 'Apple',
                    })
                );
            });
        });

        it('should be case-insensitive', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'apple' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        items: expect.arrayContaining([mockItems[0]]),
                    })
                );
            });
        });

        it('should filter items by description', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'cherry fruit' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        items: [mockItems[2]],
                    })
                );
            });
        });

        it('should reset to page 1 when searching', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'A' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        currentPage: 1,
                    })
                );
            });
        });

        it('should return empty results for non-matching search', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        items: [],
                        totalItems: 0,
                    })
                );
            });
        });
    });

    describe('Sorting', () => {
        it('should sort by name ascending', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const sortBtn = screen.getByTestId('sort-name');
            fireEvent.click(sortBtn);

            await waitFor(() => {
                const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
                expect(result.items[0].name).toBe('Apple');
                expect(result.sortOrder).toBe('asc');
            });
        });

        it('should toggle sort order on same field', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const sortBtn = screen.getByTestId('sort-name');
            fireEvent.click(sortBtn);
            fireEvent.click(sortBtn);

            await waitFor(() => {
                const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
                expect(result.sortOrder).toBe('desc');
            });
        });

        it('should display sort direction indicator', async () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);

            const sortBtn = screen.getByTestId('sort-name');
            fireEvent.click(sortBtn);

            await waitFor(() => {
                expect(sortBtn).toHaveTextContent('Name ↑');
            });
        });
    });

    describe('Pagination', () => {
        it('should disable previous button on page 1', () => {
            render(<FilterPanel items={mockItems} onFilter={() => { }} />);
            expect(screen.getByTestId('prev-btn')).toBeDisabled();
        });

        it('should navigate to next page', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const nextBtn = screen.getByTestId('next-btn');
            fireEvent.click(nextBtn);

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        currentPage: 2,
                    })
                );
            });
        });

        it('should navigate to previous page', async () => {
            const mockCallback = jest.fn();
            const { rerender } = render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const nextBtn = screen.getByTestId('next-btn');
            fireEvent.click(nextBtn);

            await waitFor(() => {
                const prevBtn = screen.getByTestId('prev-btn');
                fireEvent.click(prevBtn);
            });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        currentPage: 1,
                    })
                );
            });
        });

        it('should disable next button on last page', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            // Calculate last page (12 items, 10 per page = 2 pages)
            const nextBtn = screen.getByTestId('next-btn');
            fireEvent.click(nextBtn);

            await waitFor(() => {
                // Now on page 2, next should be disabled
                const currentNextBtn = screen.getByTestId('next-btn');
                expect(currentNextBtn).toBeDisabled();
            });
        });

        it('should update page info correctly', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            await waitFor(() => {
                expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 2');
            });
        });
    });

    describe('Page Size', () => {
        it('should change items per page', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const pageSizeSelect = screen.getByTestId('page-size');
            fireEvent.change(pageSizeSelect, { target: { value: '5' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pageSize: 5,
                        items: expect.any(Array),
                    })
                );
            });
        });

        it('should reset to page 1 when changing page size', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const pageSizeSelect = screen.getByTestId('page-size');
            fireEvent.change(pageSizeSelect, { target: { value: '25' } });

            await waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(
                    expect.objectContaining({
                        currentPage: 1,
                    })
                );
            });
        });

        it('should display correct item count for page size', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const pageSizeSelect = screen.getByTestId('page-size');
            fireEvent.change(pageSizeSelect, { target: { value: '5' } });

            await waitFor(() => {
                const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
                expect(result.items.length).toBeLessThanOrEqual(5);
            });
        });
    });

    describe('Results Display', () => {
        it('should show correct results count', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            await waitFor(() => {
                expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 10 of 12');
            });
        });

        it('should update results count on search', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'Apple' } });

            await waitFor(() => {
                expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 1 of 1');
            });
        });

        it('should show zero results for empty search', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'XYZ' } });

            await waitFor(() => {
                expect(screen.getByTestId('results-count')).toHaveTextContent('Showing 0 of 0');
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty items array', () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={[]} onFilter={mockCallback} />);
            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
        });

        it('should handle undefined onFilter callback', () => {
            expect(() => {
                render(<FilterPanel items={mockItems} />);
            }).not.toThrow();
        });

        it('should handle items without description', () => {
            const itemsWithoutDesc = [{ id: 1, name: 'Item' }];
            const mockCallback = jest.fn();
            render(<FilterPanel items={itemsWithoutDesc} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'Item' } });

            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
        });

        it('should handle null items gracefully', () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={null} onFilter={mockCallback} />);
            expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
        });

        it('should handle rapid search changes', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            fireEvent.change(searchInput, { target: { value: 'A' } });
            fireEvent.change(searchInput, { target: { value: 'AP' } });
            fireEvent.change(searchInput, { target: { value: 'APP' } });
            fireEvent.change(searchInput, { target: { value: 'Apple' } });

            await waitFor(() => {
                expect(mockCallback.mock.calls.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Integration', () => {
        it('should work with combined filters and sorting', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            const sortBtn = screen.getByTestId('sort-name');

            fireEvent.change(searchInput, { target: { value: 'berry' } });
            fireEvent.click(sortBtn);

            await waitFor(() => {
                const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
                expect(result.sortOrder).toBe('asc');
                expect(result.searchTerm).toBe('berry');
            });
        });

        it('should maintain state across interactions', async () => {
            const mockCallback = jest.fn();
            render(<FilterPanel items={mockItems} onFilter={mockCallback} />);

            const searchInput = screen.getByTestId('search-input');
            const nextBtn = screen.getByTestId('next-btn');

            fireEvent.change(searchInput, { target: { value: 'a' } });
            fireEvent.click(nextBtn);

            await waitFor(() => {
                const result = mockCallback.mock.calls[mockCallback.mock.calls.length - 1][0];
                expect(result.searchTerm).toBe('a');
                expect(result.currentPage).toBeDefined();
            });
        });
    });
});

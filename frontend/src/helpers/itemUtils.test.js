import {
    filterItems,
    sortItems,
    paginateItems,
    getTotalPages,
    validateItem,
    validateEmail,
    getItemStats,
} from '../helpers/itemUtils';

describe('itemUtils', () => {
    describe('filterItems', () => {
        const mockItems = [
            { id: 1, name: 'Item One', description: 'Description for item one', active: true },
            { id: 2, name: 'Item Two', description: 'Another description', active: false },
            { id: 3, name: 'Test Item', description: 'Test description', active: true },
        ];

        it('should return all items when searchTerm is empty', () => {
            const result = filterItems(mockItems, '');
            expect(result).toEqual(mockItems);
        });

        it('should return all items when searchTerm is null', () => {
            const result = filterItems(mockItems, null);
            expect(result).toEqual(mockItems);
        });

        it('should filter items by name', () => {
            const result = filterItems(mockItems, 'Item One');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        it('should filter items by description', () => {
            const result = filterItems(mockItems, 'Test description');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(3);
        });

        it('should be case-insensitive', () => {
            const result = filterItems(mockItems, 'item one');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        it('should return empty array when no match found', () => {
            const result = filterItems(mockItems, 'NonExistent');
            expect(result).toHaveLength(0);
        });
    });

    describe('sortItems', () => {
        const mockItems = [
            { id: 3, name: 'Charlie', value: 30 },
            { id: 1, name: 'Alice', value: 10 },
            { id: 2, name: 'Bob', value: 20 },
        ];

        it('should sort items by name in ascending order', () => {
            const result = sortItems(mockItems, 'name', 'asc');
            expect(result[0].name).toBe('Alice');
            expect(result[1].name).toBe('Bob');
            expect(result[2].name).toBe('Charlie');
        });

        it('should sort items by name in descending order', () => {
            const result = sortItems(mockItems, 'name', 'desc');
            expect(result[0].name).toBe('Charlie');
            expect(result[1].name).toBe('Bob');
            expect(result[2].name).toBe('Alice');
        });

        it('should sort items by numeric value', () => {
            const result = sortItems(mockItems, 'value', 'asc');
            expect(result[0].value).toBe(10);
            expect(result[1].value).toBe(20);
            expect(result[2].value).toBe(30);
        });

        it('should not mutate original array', () => {
            const original = [{ id: 2, name: 'B' }, { id: 1, name: 'A' }];
            sortItems(original, 'name', 'asc');
            expect(original[0].name).toBe('B');
        });
    });

    describe('paginateItems', () => {
        const mockItems = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
        }));

        it('should return correct page of items', () => {
            const result = paginateItems(mockItems, 1, 10);
            expect(result).toHaveLength(10);
            expect(result[0].id).toBe(1);
            expect(result[9].id).toBe(10);
        });

        it('should return second page correctly', () => {
            const result = paginateItems(mockItems, 2, 10);
            expect(result).toHaveLength(10);
            expect(result[0].id).toBe(11);
            expect(result[9].id).toBe(20);
        });

        it('should return partial last page', () => {
            const result = paginateItems(mockItems, 3, 10);
            expect(result).toHaveLength(5);
            expect(result[0].id).toBe(21);
            expect(result[4].id).toBe(25);
        });

        it('should return empty array for page beyond range', () => {
            const result = paginateItems(mockItems, 4, 10);
            expect(result).toHaveLength(0);
        });

        it('should handle custom page size', () => {
            const result = paginateItems(mockItems, 1, 5);
            expect(result).toHaveLength(5);
        });
    });

    describe('getTotalPages', () => {
        it('should calculate correct total pages', () => {
            expect(getTotalPages(25, 10)).toBe(3);
            expect(getTotalPages(20, 10)).toBe(2);
            expect(getTotalPages(10, 10)).toBe(1);
        });

        it('should round up for partial pages', () => {
            expect(getTotalPages(25, 8)).toBe(4);
            expect(getTotalPages(21, 7)).toBe(3);
        });

        it('should handle edge cases', () => {
            expect(getTotalPages(0, 10)).toBe(0);
            expect(getTotalPages(1, 10)).toBe(1);
        });
    });

    describe('validateItem', () => {
        it('should return no errors for valid item', () => {
            const item = { name: 'Valid Item', description: 'Valid description' };
            const errors = validateItem(item);
            expect(errors).toEqual({});
        });

        it('should require name', () => {
            const errors = validateItem({ name: '', description: 'Valid' });
            expect(errors.name).toBeDefined();
            expect(errors.name).toBe('Name is required');
        });

        it('should require description', () => {
            const errors = validateItem({ name: 'Valid', description: '' });
            expect(errors.description).toBeDefined();
            expect(errors.description).toBe('Description is required');
        });

        it('should validate minimum name length', () => {
            const errors = validateItem({ name: 'ab', description: 'Valid' });
            expect(errors.name).toBe('Name must be at least 3 characters');
        });

        it('should validate maximum name length', () => {
            const errors = validateItem({
                name: 'a'.repeat(101),
                description: 'Valid',
            });
            expect(errors.name).toBe('Name must be less than 100 characters');
        });

        it('should trim whitespace when validating', () => {
            const errors = validateItem({ name: '   ', description: 'Valid' });
            expect(errors.name).toBeDefined();
        });

        it('should report multiple errors', () => {
            const errors = validateItem({ name: '', description: '' });
            expect(Object.keys(errors)).toHaveLength(2);
        });
    });

    describe('validateEmail', () => {
        it('should validate correct email format', () => {
            expect(validateEmail('user@example.com')).toBe(true);
            expect(validateEmail('test.user@domain.co.uk')).toBe(true);
        });

        it('should reject invalid email format', () => {
            expect(validateEmail('invalid')).toBe(false);
            expect(validateEmail('user@')).toBe(false);
            expect(validateEmail('@example.com')).toBe(false);
            expect(validateEmail('user@.com')).toBe(false);
            expect(validateEmail('user space@example.com')).toBe(false);
        });

        it('should reject empty email', () => {
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('getItemStats', () => {
        it('should calculate correct stats', () => {
            const items = [
                { id: 1, active: true },
                { id: 2, active: true },
                { id: 3, active: false },
            ];
            const stats = getItemStats(items);
            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.inactive).toBe(1);
        });

        it('should handle empty array', () => {
            const stats = getItemStats([]);
            expect(stats.total).toBe(0);
            expect(stats.active).toBe(0);
            expect(stats.inactive).toBe(0);
        });

        it('should handle all active items', () => {
            const items = [{ id: 1, active: true }, { id: 2, active: true }];
            const stats = getItemStats(items);
            expect(stats.total).toBe(2);
            expect(stats.active).toBe(2);
            expect(stats.inactive).toBe(0);
        });

        it('should handle all inactive items', () => {
            const items = [{ id: 1, active: false }, { id: 2, active: false }];
            const stats = getItemStats(items);
            expect(stats.total).toBe(2);
            expect(stats.active).toBe(0);
            expect(stats.inactive).toBe(2);
        });
    });
});

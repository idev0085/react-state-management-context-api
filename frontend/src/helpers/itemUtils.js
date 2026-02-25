export const filterItems = (items, searchTerm) => {
    if (!searchTerm) return items;
    return items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const sortItems = (items, sortBy, sortOrder) => {
    const sorted = [...items];
    sorted.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    return sorted;
};

export const paginateItems = (items, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
};

export const getTotalPages = (itemCount, pageSize) => {
    return Math.ceil(itemCount / pageSize);
};

export const validateItem = (item) => {
    const errors = {};
    if (!item.name || item.name.trim() === '') {
        errors.name = 'Name is required';
    }
    if (!item.description || item.description.trim() === '') {
        errors.description = 'Description is required';
    }
    if (item.name && item.name.length < 3) {
        errors.name = 'Name must be at least 3 characters';
    }
    if (item.name && item.name.length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }
    return errors;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getItemStats = (items) => {
    return {
        total: items.length,
        active: items.filter(item => item.active).length,
        inactive: items.filter(item => !item.active).length,
    };
};

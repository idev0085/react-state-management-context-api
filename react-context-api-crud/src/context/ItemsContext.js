// src/context/ItemsContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ItemsContext = createContext();
const API_URL = 'http://localhost:5000/api/items';

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const itemsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, items: action.payload, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case 'DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        default:
            return state;
    }
};

export const ItemsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(itemsReducer, initialState);

    const fetchItems = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    }, []);

    const addItem = useCallback(async (item) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
            const newItem = await response.json();
            dispatch({ type: 'ADD_ITEM', payload: newItem });
            return newItem;
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    }, []);

    const updateItem = useCallback(async (item) => {
        try {
            const response = await fetch(`${API_URL}/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            });
            const updatedItem = await response.json();
            dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
            return updatedItem;
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    }, []);

    const deleteItem = useCallback(async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            dispatch({ type: 'DELETE_ITEM', payload: id });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    }, []);

    const value = {
        ...state,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
    };

    return (
        <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemsContext);
    if (!context) {
        throw new Error('useItems must be used within ItemsProvider');
    }
    return context;
};

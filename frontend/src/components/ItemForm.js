// src/components/ItemForm.js
import React, { useState, useEffect } from 'react';
import { useItems } from '../context/ItemsContext';

const initialForm = { id: '', title: '', description: '' };

export default function ItemForm({ editingItem, onCancel }) {
    const [form, setForm] = useState(initialForm);
    const { addItem, updateItem } = useItems();

    useEffect(() => {
        if (editingItem) setForm(editingItem);
        else setForm(initialForm);
    }, [editingItem]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) return;

        if (form.id) {
            await updateItem({ ...form });
        } else {
            await addItem({ ...form });
        }
        setForm(initialForm);
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Item title"
                required
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Item description"
            />
            <button type="submit">{form.id ? 'Update' : 'Add'}</button>
            {form.id && <button onClick={onCancel}>Cancel</button>}
        </form>
    );
}

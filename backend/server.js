// backend/server.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let items = [
    { id: '1', title: 'Learn React', description: 'Master React fundamentals' },
    { id: '2', title: 'Learn Node.js', description: 'Build backend with Node.js' },
    { id: '3', title: 'Learn Databases', description: 'Understand SQL and NoSQL' },
];

// Routes

// GET all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET single item
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// POST create new item
app.post('/api/items', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = {
        id: uuidv4(),
        title,
        description: description || '',
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
    const { title, description } = req.body;
    const item = items.find(i => i.id === req.params.id);

    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    if (title) item.title = title;
    if (description !== undefined) item.description = description;

    res.json(item);
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = items.splice(index, 1);
    res.json(deletedItem[0]);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`API base URL: http://localhost:${PORT}/api`);
});

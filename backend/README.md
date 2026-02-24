# React CRUD Backend

Simple Node.js Express backend API for React state management examples.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

The server runs on `http://localhost:5000`

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /health` - Health check

## Example Request

```javascript
// Get all items
fetch('http://localhost:5000/api/items')
  .then(res => res.json())
  .then(data => console.log(data));

// Create item
fetch('http://localhost:5000/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New Item', description: 'Description' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

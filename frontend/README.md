# React Context API CRUD

A CRUD application demonstrating **React Context API** for state management with a Node.js backend.

## Features

- ✅ Fetch items from backend API
- ✅ Create new items
- ✅ Update existing items
- ✅ Delete items
- ✅ Client-server synchronization
- ✅ Error handling and loading states

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

The app runs on `http://localhost:3000`

## API Configuration

The app connects to the backend at `http://localhost:5000/api/items`

Make sure the backend server is running:

```bash
cd ../backend
npm start
```

## State Management

Uses **React Context API** with `useReducer` for state management:

- `ItemsContext` - Global items state and actions
- `useItems()` - Custom hook to access context
- `ItemsProvider` - Context provider component

## Components

- `ItemForm` - Add/Edit items
- `ItemList` - Display and manage items
- `ItemsContext` - State management

## Key Concepts

### Context API

```javascript
// Create context
const ItemsContext = createContext();

// Provider
<ItemsProvider>
  <App />
</ItemsProvider>

// Consumer
const { items, addItem, updateItem, deleteItem } = useItems();
```

### Reducer Pattern

```javascript
const itemsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    // ...
  }
};
```

## Comparison with Other Approaches

| Aspect | Context API |
|--------|-------------|
| Complexity | Low |
| Boilerplate | Minimal |
| Performance | Good for small apps |
| DevTools | Limited |
| Learning Curve | Gentle |
| Best For | Small-medium apps |

## When to Use Context API

✅ Small to medium applications
✅ Learning React state management
✅ Want to avoid external libraries
✅ Simple to moderate state requirements

❌ Very large applications
❌ Complex async flows
❌ Need time-travel debugging
❌ Performance-critical apps

## Resources

- [React Context Documentation](https://react.dev/reference/react/useContext)
- [useReducer Hook](https://react.dev/reference/react/useReducer)

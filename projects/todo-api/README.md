# Simple Todo API

A beginner-friendly REST API for managing todos using Express.js and JSON file storage.

## Features

- ✅ Create, Read, Update, Delete todos (CRUD operations)
- 📝 Persistent storage using JSON file
- 🚀 Easy to understand and modify

## Prerequisites

- Node.js installed on your machine

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install express
```

## Usage
Start the server
```bash 
node server.js 
# or
npm run dev
```

Server will run on http://localhost:5500


## API Endpoints

| Method | Endpoint | Description |
|------|-------------|
| Get | `/todos` | Get all todos |
| Get | `/todos/:id` | Get a specific todo |
| Post | `/todos` | Create a new todo |
| Put | `/todos/:id` | Update a todo |
| Delete | `/todos/:id` | Delete a todo |

### Example

```bash

# GET - All todos
curl http://localhost:5500/todos

# GET - One todo
curl http://localhost:5500/todos/1

# Create - A todo
curl -X POST http://localhost:5500/todos \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy groceries"}'

# Update - A todo
curl -X PUT http://localhost:5500/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"task": "Buy organic groceries", "complete": true}'

# Delete - A todo
curl -X DELETE http://localhost:5500/todos/1

```

## Data Structure

Each todo has the following structure:

```json

{
  "id": 1,
  "task": "Learn Express",
  "complete": false
}

```

## Project Structure

```text
├── server.js      # Main application code
├── todos.json     # Data storage file
└── README.md      # This file
```

## Notes

- The todos.json file is automatically created/modified when you run the server
- IDs auto-increment based on the array length
- Server must be restarted if you manually edit todos.json
import express from 'express'
import fs from 'fs'
const app = express();

app.use(express.json());

const TODOS_FILE = './todos.json';

// Helper to read todos
const getTodos = () => JSON.parse(fs.readFileSync(TODOS_FILE));

// Helper to save todos
const saveTodos = (todos) => fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));

// CREATE - Add a new todo
app.post("/todos", (req, res) => {
  const todos = getTodos();
  const newToDo = {
    id: todos.length + 1,
    task: req.body.task,
    complete: false
  }
  todos.push(newToDo);
  saveTodos(todos);
  res.status(201).json(newToDo)
})

// READ - Get all todos
app.get("/todos", (req, res) => {
  res.json(getTodos())
})

// READ - Get one todo
app.get("/todos/:id", (req, res) => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  todo ? res.json(todo) : res.status(404).json({ error: 'Todo not found' });
})

// UPDATE - Update todo (FIXED)
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todos = getTodos();
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) return res.status(404).json({ error: 'Todo not found' });
  
  todos[index] = { ...todos[index], ...req.body };
  saveTodos(todos);
  res.json(todos[index]);
});

// DELETE - Remove todo
app.delete('/todos/:id', (req, res) => {
  const todos = getTodos();
  const filtered = todos.filter(t => t.id !== parseInt(req.params.id));
  saveTodos(filtered);
  res.status(204).send();
})

app.listen(5500, () => {
  console.log("Server running on http://localhost:5500")
})
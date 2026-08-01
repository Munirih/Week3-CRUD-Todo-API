require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors('*'));

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false, DueDate: null},
    { id: 2, task: 'Build CRUD API', completed: false, DueDate: null }
]

// read all todos
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
})


// create a new todo
app.post('/todos/add_todo', (req, res) => {
    const { task, completed, DueDate } = req.body
    if (!task) {
        return res.status(400).json({ error: 'Task is required' })
    }
    const newTodo = { id: todos.length + 1, task, completed, DueDate}
    todos.push(newTodo)
    res.status(201).json(newTodo)
})

// Update a todo
app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const todo = todos.find(t => t.id === id)
    if (!todo) {
        return res.status(404).json({ error: 'Task does not exist' })
    }
    Object.assign(todo, req.body)
    res.status(200).json(todo)
})

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id)
    if (todos.length === initialLength) {
        return res.status(404).json({ error: 'Task does not found!' })
    }
    res.status(204).send('Task deleted successfully');
})

// Get Active Todos
app.get('/todos/active', (req, res) => {
    const active = todos.filter(t => t.completed)
    res.status(200).json(active)
})

// get a single todo by id
app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id)
    const todo = todos.find(t => t.id === todoId)
    if (!todo) {
        return res.status(404).json({ error: 'Task not found!'})
    }
    res.status(200).json(todo)
})



app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error'})
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
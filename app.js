require('dotenv').config();
const logRequest = require('./middlewares/logger');
const validatorTodo = require('./middlewares/validator');
const errorHandler = require('./middlewares/errorHandler');
const patchValidator = require('./middlewares/patchValidator');

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors('*'));
app.use(logRequest)

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build CRUD API', completed: true }
]


// get all todos
app.get('/todos', (req, res, next) => {
    try {
        if (todos.length === 0) {
                return res.status(200).json({ message: 'No Tasks Found!', count: todos.length, timestamp: new Date().toISOString(), todos: todos })
            }
            res.status(200).json({ message: 'Tasks retrieved successfully', count: todos.length, timestamp: new Date().toISOString(), todos: todos });
    }
    catch (error) {
        next(error)
    }
})


// create a new todo
app.post('/todos/add_todo', validatorTodo, (req, res, next) => {
    try {
        const { task, completed } = req.body
        if (!task || task.length < 3) {
            return res.status(400).json({ message: 'Provide a task with at least 3 characters' })
        }
        const newTodo = { id: todos.length + 1, task, completed }
        todos.push(newTodo)
        res.status(201).json(newTodo)
    }
    catch (error) {
        next(error)
    }
})

// Update a todo
app.patch('/todos/:id', patchValidator,(req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const todo = todos.find(t => t.id === id)
        if (!todo) {
            return res.status(404).json({ error: 'Task does not exist' })
        }
        Object.assign(todo, req.body)
        res.status(200).json(todo)
    }
    catch (error){
        next(error)
    }
})

// Delete a todo
app.delete('/todos/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const initialLength = todos.length;
        todos = todos.filter(t => t.id !== id)
        if (todos.length === initialLength) {
            return res.status(404).json({ error: 'Task not found!' })
        }
        res.status(204).send('Task deleted successfully');
    }
    catch (error) {
        next(error)
    }
})

// Get Active Todos
app.get('/todos/active', (req, res, next) => {
    try {
        const activeTodos = todos.filter(t => !t.completed)
        res.status(200).json(activeTodos)
    }
    catch (error) {
        next(error)
    }
})

// get a single todo by id
app.get('/todos/:id', (req, res, next) => {
    try {
        const todoId = parseInt(req.params.id)
        if (isNaN(todoId)) {
            throw new Error('Invalid ID');
        }
        const todo = todos.find(t => t.id === todoId)
        if (!todo) {
            return res.status(404).json({ error: 'Task not found!'})
        }
        res.status(200).json({ message: 'Task retrieved successfully', todo })
    }
    catch (error) {
        next(error)
    }
})


app.use(errorHandler)

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).send("Page not found :(");
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
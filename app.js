require('dotenv').config();


const logRequest = require('./middlewares/logger');
const validatorTodo = require('./middlewares/validator');
const errorHandler = require('./middlewares/errorHandler');
const patchValidator = require('./middlewares/patchValidator');
const connectDB = require('./database/db');
const Todo = require('./models/todo.model')

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors('*'));

connectDB();

app.use(logRequest)

//landing page
app.get('/', (req, res) => {
    res.send('Hello, Welcome to my TODO App!')
})

// get all todos
app.get('/todos', async (req, res, next) => {
    try {
        const filter = {};
        
        if (req.query.completed === 'true') {
                filter.completed = true;
        } 
        if (req.query.completed === 'false') {
                filter.completed = false;
        }
        
        console.log("Sent to MongoDB:", filter);
        const todos = await Todo.find(filter)
        return res.status(200).json(todos)
    }
    catch (error) {
        next(error)
    }
})


// create a new todo
app.post('/todos/add_todo', validatorTodo, async (req, res, next) => {
    try {
        const { task, completed } = req.body
        const newTodo = new Todo({
            task,
            completed
        })
        await newTodo.save()
        res.status(201).json(newTodo)
    }
    catch (error) {
        next(error)
    }
})

// Update a todo
app.patch('/todos/:id', patchValidator, async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })
        if (!todo) {
            return res.status(404).json({ message: 'Task Not Found!' })
        }    
        res.status(200).json(todo)
    }
    catch (error){
        next(error)
    }
})

// Delete a todo
app.delete('/todos/:id', async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id)
        if (!todo) {
            return res.status(404).json({ message: 'Task Not Found!' })
        }
        res.status(204).json({ message: `Task ID: ${req.params.id} deleted successfully` });
    }
    catch (error) {
        next(error)
    }
})


// get a single todo by id
app.get('/todos/:id', async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id)
        if (!todo) {
            return res.status(404).json({ message: 'Task Not Found!' })
        }    
        res.status(200).json({message: 'Task retrieved successfully', todo })
    }
    catch (error){
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
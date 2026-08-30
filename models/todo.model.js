const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    task:{
        type: String, 
        required: true,
        unique: true,
        minlength: 3,
    },
    completed:{
        type: Boolean,
        default: false,
    },
}, {timestamps: true}

);

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;
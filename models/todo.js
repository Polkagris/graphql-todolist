const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;

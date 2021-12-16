const { Schema, model } = require('../database');

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Task = model('Task', TaskSchema);

module.exports = Task;

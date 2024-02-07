const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {type: String, required: true, default: "Project" },
  review: {type: String, required: true, default: "-" },
  images: [{type: String, required: true, minLength: 2 }],
  isCompleted: {type: Boolean, required: true, default: false},
  users_working: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  start_date: {type: Date, required: true, default: Date.now() },
});

projectSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Project', projectSchema);
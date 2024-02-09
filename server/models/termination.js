const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const terminationSchema = new Schema({
  reason: {type: String, required: true, default: '-' },
  employee: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  date_terminated: {type: Date },
  date_applied: {type: Date } 
});

terminationSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Termination', terminationSchema);
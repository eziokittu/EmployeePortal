const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {type: String, required: true, default: "Project Title" },
  description: {type: String, required: true, default: "-" },
  review: {type: String, required: true, default: "-" },
  srs: {type: String, required: true, minLength: 4, default: process.env.DB_USER_DEFAULT_SRS },
  isCompleted: {type: Boolean, required: true, default: false},
  domain: { type: mongoose.Types.ObjectId, required: true, ref: 'Domain', default: '-' },
  employees: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  date_start: {
    type: Date,
    required: true,
    default: Date.now()
  },
  date_end: {type: Date, required: true, default: Date.now() + 1000*60*60*24*90 } // 90 days date end
});

projectSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Project', projectSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const appliedSchema = new Schema({
  type: {type: String, required: true, default: 'internship' },
  link: {type: String, required: true, default: '-' },
  resume: {type: String, required: true, minLength: 2, default: process.env.DB_USER_DEFAULT_RESUME },
  offer: { type: mongoose.Types.ObjectId, required: true, ref: 'Offer' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  date_applied: {type: Date, required: true, default: Date.now() },
});

appliedSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Applied', appliedSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  type: {type: String, required: true, default: 'internship' },
  heading: {type: String, required: true,  },
  link: {type: String, default: 'https://www.google.com'},
  ctc: {type: String, default: '-'},
  stipend: {type: String, default: '-'},
  // image: {type: String, required: true, minLength: 4, default: 'image.png' },
  users_applied: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  date_posting: {type: Date, required: true, default: Date.now() },
  date_start: {type: Date, required: true, default: Date.now() },
  date_end: {type: Date, required: true, default: Date.now() },
});

offerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Offer', offerSchema);
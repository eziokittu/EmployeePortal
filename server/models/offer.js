const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  type: {type: String, required: true, default: 'Internship' },
  heading: {type: String, required: true,  },
  link: {type: String},
  image: {type: String, required: true, minLength: 4, default: 'image.png' },
  users_applied: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  end_date: {type: Date, required: true, default: Date.now() },
});

offerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Offer', offerSchema);
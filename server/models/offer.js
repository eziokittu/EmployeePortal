const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  type: {type: String, required: true, default: 'internship' },
  heading: {type: String, required: true,  },
  link: {type: String, default: 'https://www.google.com'},
  ctc: {type: String, default: '-'},
  stipend: {type: String, default: '-'},
  domain: { type: mongoose.Types.ObjectId, required: true, ref: 'Domain' },
  date_posting: {type: Date, required: true, default: Date.now() },
  date_start: {type: Date, required: true, default: Date.now() + 1000*60*60*24*8 }, // start date after 8 days
  date_end: {type: Date, required: true, default: Date.now() } // end date after 7 days
});

offerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Offer', offerSchema);
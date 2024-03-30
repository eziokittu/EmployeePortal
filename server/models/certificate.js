const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  issueDate: {type: String, required: true, default: Date.now() },
  certificate: {type: String, required: true, minLength: 4, default: process.env.DB_USER_DEFAULT_CERTIFICATE },
  domain: { type: mongoose.Types.ObjectId, required: true, ref: 'Domain' },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

certificateSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Certificate', certificateSchema);
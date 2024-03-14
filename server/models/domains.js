const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
  name: {type: String, required: true, unique: true, default: '-' },
  name1: {type: String, required: true, default: '-' },
  name2: {type: String, required: true, default: '-' }
});

domainSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Domain', domainSchema);
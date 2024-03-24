const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {type: String, required: true, unique: true },
});

roleSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Role', roleSchema);
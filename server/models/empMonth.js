const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const empMonthSchema = new Schema({
  amount: {type: String, required: false, default: 'Rs 1000' },
  stipend: {type: String, required: true, minLength: 4, default: process.env.DB_USER_DEFAULT_STIPEND },
  employee: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  monthYear: {type: String, required: true },
});

empMonthSchema.plugin(uniqueValidator);
module.exports = mongoose.model('EmpMonth', empMonthSchema);
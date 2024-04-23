const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const empMonthSchema = new Schema({
  amount: {type: String, required: false, default: 'Rs 1000' },
  employees: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  date_posted: {type: Date, required: true, default: Date.now() },
});

empMonthSchema.plugin(uniqueValidator);
module.exports = mongoose.model('EmpMonth', empMonthSchema);
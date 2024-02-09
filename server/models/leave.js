const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  reason: {type: String, required: true, default: 'Vacation' },
  employee: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  date_start: {type: Date, required: true, default: Date.now() },
  date_end: {type: Date, required: true, default: Date.now()+(1000*60*60*24*7) }, // 7 days - end of leave
  isApproved: {type: Boolean, required: true, default: false },
});

leaveSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Leave', leaveSchema);
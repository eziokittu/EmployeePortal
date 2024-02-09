const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {type: String, required: true, default: "Project Title" },
  description: {type: String, required: true, default: "-" },
  review: {type: String, required: true, default: "-" },
  projectId: {type: String, required: true, unique: true },
  // images: [{type: String, required: true, minLength: 2 }],
  isCompleted: {type: Boolean, required: true, default: false},
  employees: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  date_start: {
    type: Date,
    required: true,
    default: Date.now()
    // set: (val) => {
    //   const date = new Date(val);
    //   // IST is UTC+5:30. To convert to IST, add 5 hours and 30 minutes to the date
    //   const offsetInHours = 5;
    //   const offsetInMinutes = 30;
    //   date.setUTCHours(offsetInHours, offsetInMinutes, 0, 0);
  
    //   // Adjust for the IST offset by subtracting the offset to get the start of the day in IST
    //   // Note: This is a simplistic approach and might not account for daylight saving changes or other edge cases
    //   const ISTOffset = -(date.getTimezoneOffset() / 60 - offsetInHours) * 60 - offsetInMinutes;
    //   date.setMinutes(date.getMinutes() - ISTOffset);
  
    //   return date;
    // }
  },
  date_end: {type: Date},
});

projectSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Project', projectSchema);
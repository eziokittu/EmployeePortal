const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {type: String, required: true },
    lastname: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    image: {type: String, required: true, minLength: 4, default: process.env.DB_USER_DEFAULT_IMAGE },
    isEmployee: {type: Boolean, required: true, default: false },
    isAdmin: {type: Boolean, required: true, default: false },
    userName: { type: String, required: true, unique: true },
    phone: {type: String, required: true, default: '91XXXXXXXX' },
    bio: {type: String, required: true, default: '-' },

    ref: {type: String, required:true, default: "-"}, // RNPW/2024-25/WEB123DEV
    rating: {type: Number, required: true, default: 0 },
    certificates: [{type: String, minLength: 4 }],
    domain: { type: mongoose.Types.ObjectId, ref: 'Domain' },
    projects: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Project' }],
    projects_complete: {type: Number, required: true, default: 0},
    projects_ongoing: {type: Number, required: true, default: 0},
    tenure: {type: String, required: true, default: "1 year" },
    date: {type: Date, required: true, default: Date.now() },
    isTerminated: {type: Boolean, required: true, default: false }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
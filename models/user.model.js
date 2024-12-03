const mongoose = require('mongoose');
const validator = require('validator');
const userRole = require('../utils/userRole');
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // validate: [validator.isEmail, 'Email must be correct Email Address']
    },
    password: {
        type: String,
        required: true,
        // validate: [validator.isLength, { min: 4 }]
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
        default: 'USER'
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    }
})

module.exports = mongoose.model('User', userSchema);


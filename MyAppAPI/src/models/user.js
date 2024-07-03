const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    dateOfBirth: {
        type: Date,
        unique: false
    }, 
    password: {
        type: String,
        required: true
    },
    profileImagePath: {
        type: String,
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
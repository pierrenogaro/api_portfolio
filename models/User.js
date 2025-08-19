const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('User', UserSchema);

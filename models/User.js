const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;

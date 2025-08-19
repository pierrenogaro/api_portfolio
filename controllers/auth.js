const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    let { ...userParams } = req.body;
    const existingUser = await User.findOne({ username: userParams.username });

    if (existingUser) {
        return res.status(400).json({ error: '🔴 Username already exists. Please choose a different one.' });
    }

    userParams.password = await bcrypt.hash(userParams.password, 10);
    const user = new User(userParams);

    const saveUser = await user.save();
    if (saveUser) {
        res.status(201).json({ message: '🎉 User created successfully! Welcome aboard.' });
    } else {
        res.status(500).json({ error: '🔴 An error occurred while creating the user. Please try again.' });
    }
}

async function login(req, res) {
    let { ...userParams } = req.body;
    const user = await User.findOne({ username: userParams.username });

    if (user) {
        const passwordMatch = await bcrypt.compare(userParams.password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, message: '🔓 Login successful! You are now logged in.' });
        } else {
            return res.status(400).json({ error: '🔴 Incorrect password. Please try again.' });
        }
    } else {
        return res.status(400).json({ error: '🔴 No user found with this username. Please check your credentials.' });
    }
}

module.exports = { register, login };
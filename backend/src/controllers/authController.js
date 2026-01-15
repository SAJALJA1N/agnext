const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');


const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};


exports.register = asyncHandler(async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { name, email, password } = req.body;
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email already in use' });


const user = await User.create({ name, email, password });
res.status(201).json({
user: { id: user._id, name: user.name, email: user.email },
token: generateToken(user._id),
});
});


exports.login = asyncHandler(async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const isMatch = await user.matchPassword(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });


res.json({ user: { id: user._id, name: user.name, email: user.email }, token: generateToken(user._id) });
});


exports.profile = asyncHandler(async (req, res) => {
const user = await User.findById(req.user.id).select('-password');
if (!user) return res.status(404).json({ message: 'User not found' });
res.json(user);
});
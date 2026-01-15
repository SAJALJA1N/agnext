const express = require('express');
const { body } = require('express-validator');
const { register, login, profile } = require('../controllers/authController');
const protect = require('../middleware/auth');
const router = express.Router();
router.post(
'/register',
[
body('name').trim().notEmpty().withMessage('Name is required'),
body('email').isEmail().withMessage('Please include a valid email'),
body('password').isLength({ min: 6 }).withMessage('Password must be 6 ormore characters'),
],
register
);
router.post(
'/login',
[body('email').isEmail(), body('password').exists()],
login
);
router.get('/profile', protect, profile);
module.exports = router;
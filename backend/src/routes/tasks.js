const express = require('express');
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const taskController = require('../controllers/taskController');
const router = express.Router();
// protected routes
router.use(protect);
router.get('/', taskController.getTasks);
router.post(
'/',
[body('title').notEmpty().withMessage('Title is required')],
taskController.createTask
);
router.get('/stats', taskController.getStats);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
module.exports = router;
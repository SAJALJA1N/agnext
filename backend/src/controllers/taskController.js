const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');


exports.getTasks = asyncHandler(async (req, res) => {
const { status, priority, category, q, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;


const filter = { userId: req.user.id };
if (status) filter.status = status;
if (priority) filter.priority = priority;
if (category) filter.category = category;
if (q) filter.$or = [
{ title: { $regex: q, $options: 'i' } },
{ description: { $regex: q, $options: 'i' } },
];


const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };


const [tasks, total] = await Promise.all([
Task.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
Task.countDocuments(filter),
]);


res.json({ tasks, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});


// POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { title, description, category, priority, status, dueDate } = req.body;
const task = await Task.create({ title, description, category, priority, status, dueDate, userId: req.user.id });
res.status(201).json(task);
});


// GET /api/tasks/:id
exports.getTask = asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task id' });


const task = await Task.findById(id);
if (!task || task.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });
res.json(task);
});


// PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task id' });


const task = await Task.findById(id);
if (!task || task.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });


const updates = (({ title, description, category, priority, status, dueDate }) => ({ title, description, category, priority, status, dueDate }))(req.body);
Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);


Object.assign(task, updates);
await task.save();


res.json(task);
});


// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task id' });


const task = await Task.findById(id);
if (!task || task.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Task not found' });


await task.remove();
res.json({ message: 'Task deleted' });
});


// GET /api/tasks/stats
exports.getStats = asyncHandler(async (req, res) => {
const userId = req.user.id;


const [byStatus, byPriority, overdueCount, total] = await Promise.all([
Task.aggregate([
{ $match: { userId: mongoose.Types.ObjectId(userId) } },
{ $group: { _id: '$status', count: { $sum: 1 } } },
]),
Task.aggregate([
{ $match: { userId: mongoose.Types.ObjectId(userId) } },
{ $group: { _id: '$priority', count: { $sum: 1 } } },
]),
Task.countDocuments({ userId, dueDate: { $lt: new Date() }, status: { $ne: 'Completed' } }),
Task.countDocuments({ userId }),
]);


const format = (arr) => arr.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {});


res.json({ total, byStatus: format(byStatus), byPriority: format(byPriority), overdue: overdueCount });
});
const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema(
{
title: { type: String, required: true },
description: { type: String },
category: { type: String, default: 'General' },
priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
dueDate: { type: Date },
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
);


module.exports = mongoose.model('Task', TaskSchema);
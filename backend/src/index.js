const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve React frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

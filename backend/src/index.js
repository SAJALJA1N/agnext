require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5001;

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// Connect to MongoDB
console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ---------- FRONTEND SERVING (VITE) ----------
app.use(
  express.static(path.join(__dirname, "../../frontend/dist"))
);

// React routing support
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/dist/index.html")
  );
});

// Error handling (LAST)
app.use(notFound);
app.use(errorHandler);

// Start server (VERY LAST)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
